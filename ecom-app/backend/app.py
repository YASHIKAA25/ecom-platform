# backend/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from config import Config
from models import db, Product, User, Order, OrderItem, Notification
from flask_migrate import Migrate
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from flask_bcrypt import Bcrypt
from sqlalchemy import or_
import re
import logging

app = Flask(__name__)
app.config.from_object(Config)
app.config['DEBUG'] = True
app.config['JSON_SORT_KEYS'] = False  # predictable field order

# --- Extensions ---
db.init_app(app)
migrate = Migrate(app, db)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Create tables if not present
with app.app_context():
    db.create_all()

# --- Logging ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ecom-backend")

# ------------------------------ Root & Health ------------------------------
@app.route("/", methods=["GET"])
def root():
    return jsonify({
        "ok": True,
        "message": "E-Com API running",
        "endpoints": [
            "GET /api/products",
            "GET /api/products/<id>",
            "POST /api/register",
            "POST /api/login",
            "POST /api/orders",
            "GET  /api/orders/history",
            "GET  /api/categories"
        ]
    })

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"ok": True})

# ------------------------------ JWT Error Handlers ------------------------------
@jwt.unauthorized_loader
def handle_unauthorized(err):
    return jsonify({"error": "Missing or invalid Authorization header", "detail": err}), 401

@jwt.invalid_token_loader
def handle_invalid_token(err):
    return jsonify({"error": "Invalid token", "detail": err}), 401

@jwt.expired_token_loader
def handle_expired_token(jwt_header, jwt_payload):
    return jsonify({"error": "Token expired"}), 401

# ------------------------------ User Authentication ------------------------------
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json(silent=True) or {}
    username = data.get('username', '').strip()
    password = data.get('password', '')

    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'User already exists'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(username=username, password=hashed_password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    username = data.get('username', '').strip()
    password = data.get('password', '')

    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400

    user = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password, password):
        # identity must be a string for some JWT setups
        access_token = create_access_token(identity=str(user.id))
        return jsonify({'message': 'Login successful', 'access_token': access_token}), 200

    return jsonify({'error': 'Invalid credentials'}), 401

# ------------------------------ Product Endpoints ------------------------------
def _serialize_product(product: Product):
    return {
        'id': product.id,
        'name': product.name,
        'category': product.category,
        'description': product.description,
        'price': product.price,
        'image': product.image,
        'more_images': product.more_images,
        'in_stock': product.in_stock,
        'trending': product.trending
    }

@app.route('/api/products', methods=['GET'])
def get_products():
    q = request.args.get('q', default='', type=str)
    category = request.args.get('category', default='All', type=str)
    min_price = request.args.get('min_price', default=None, type=float)
    max_price = request.args.get('max_price', default=None, type=float)
    trending = request.args.get('trending', default=None, type=str)
    in_stock = request.args.get('in_stock', default=None, type=str)
    sort_by = request.args.get('sort_by', default='id', type=str)
    order = request.args.get('order', default='asc', type=str)

    query = Product.query
    if q:
        query = query.filter(or_(Product.name.ilike(f'%{q}%'),
                                 Product.description.ilike(f'%{q}%')))
    if category and category.lower() != 'all':
        query = query.filter(Product.category == category)
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    if trending is not None:
        if trending.lower() == 'true':
            query = query.filter(Product.trending.is_(True))
        elif trending.lower() == 'false':
            query = query.filter(Product.trending.is_(False))
    if in_stock is not None:
        if in_stock.lower() == 'true':
            query = query.filter(Product.in_stock > 0)
        elif in_stock.lower() == 'false':
            query = query.filter(Product.in_stock == 0)

    if sort_by in ['id', 'price', 'name', 'category', 'in_stock']:
        col = getattr(Product, sort_by)
        query = query.order_by(col.desc() if order.lower() == 'desc' else col.asc())

    products = query.all()
    return jsonify([_serialize_product(p) for p in products])

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify(_serialize_product(product))

# --- Friendly aliases (so http://localhost:5000/products works in browser) ---
@app.route('/products', methods=['GET'])
def products_alias():
    return get_products()

@app.route('/products/<int:product_id>', methods=['GET'])
def product_alias(product_id):
    return get_product(product_id)

# Distinct categories
@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = db.session.query(Product.category).distinct().all()
    return jsonify(["All"] + [c[0] for c in categories if c and c[0]])

# ------------------------------ Order Creation (Checkout) ------------------------------
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

@app.route('/api/orders', methods=['POST'])
@jwt_required()
def create_order():
    try:
        data = request.get_json(silent=True) or {}
        user_id = get_jwt_identity()
        shipping_name = (data.get('shipping_name') or '').strip()
        shipping_address = (data.get('shipping_address') or '').strip()
        shipping_email = (data.get('shipping_email') or '').strip()
        items = data.get('items') or []

        # Input validation
        if not (shipping_name and shipping_address and shipping_email):
            return jsonify({"error": "Shipping details are required"}), 422
        if not EMAIL_RE.match(shipping_email):
            return jsonify({"error": "Invalid email format"}), 422
        if not items:
            return jsonify({"error": "No items in the order"}), 422

        # Check products & stock and compute total
        product_cache = {}
        total = 0.0
        for item in items:
            pid = item.get('product_id')
            qty = int(item.get('quantity', 1))
            if not pid or qty <= 0:
                return jsonify({"error": "Each item must have a valid product_id and positive quantity"}), 422

            product = product_cache.get(pid) or Product.query.get(pid)
            if not product:
                return jsonify({"error": f"Product with ID {pid} not found"}), 422

            if product.in_stock is None:
                # defensive default if column is NOT NULL at DB level
                product.in_stock = 0

            if product.in_stock < qty:
                return jsonify({"error": f"'{product.name}' is out of stock (available: {product.in_stock})"}), 409

            product_cache[pid] = product
            total += float(product.price) * qty

        # Create order
        order = Order(
            user_id=user_id,
            total=total,
            shipping_name=shipping_name,
            shipping_address=shipping_address,
            shipping_email=shipping_email
        )
        db.session.add(order)
        db.session.flush()  # get order.id before committing

        # Create order items + decrement stock
        for item in items:
            pid = item.get('product_id')
            qty = int(item.get('quantity', 1))
            product = product_cache[pid]

            db.session.add(OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=qty,
                price=product.price
            ))

            product.in_stock = int(product.in_stock) - qty

        # Notification
        notification_message = "Your order has been placed successfully!"
        db.session.add(Notification(message=notification_message))

        db.session.commit()

        order_summary = {
            'order_id': order.id,
            'total': order.total,
            'shipping_name': order.shipping_name,
            'shipping_address': order.shipping_address,
            'shipping_email': order.shipping_email,
            'created_at': order.created_at.isoformat()
        }
        return jsonify({'message': notification_message, 'order': order_summary}), 201

    except Exception as e:
        logger.exception("Error in create_order")
        db.session.rollback()
        return jsonify({"error": "Internal server error", "detail": str(e)}), 500

# ------------------------------ Order History ------------------------------
@app.route('/api/orders/history', methods=['GET'])
@jwt_required()
def order_history():
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()

    out = []
    for order in orders:
        items = OrderItem.query.filter_by(order_id=order.id).all()
        out.append({
            'order_id': order.id,
            'total': order.total,
            'shipping_name': order.shipping_name,
            'shipping_address': order.shipping_address,
            'shipping_email': order.shipping_email,
            'created_at': order.created_at.isoformat(),
            'items': [{
                'product_id': it.product_id,
                'quantity': it.quantity,
                'price': it.price
            } for it in items]
        })
    return jsonify(out)

# ------------------------------ 404 Helper ------------------------------
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Not Found", "hint": "Use /api/products or /products"}), 404

# ------------------------------ Run ------------------------------
if __name__ == '__main__':
    # If you run behind a frontend on different port, keep CORS enabled.
    app.run(host="0.0.0.0", port=5000)

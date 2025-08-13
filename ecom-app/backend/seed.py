# backend/seed.py
from app import app, db
from models import Product
from sqlalchemy import text

sample_products = [
    {
        "name": "Smartphone X100",
        "category": "Electronics",
        "description": "Latest smartphone with cutting edge features.",
        "price": 699.99,
        "image": "https://media.giphy.com/media/JPgbfjx4d2sAAkQabX/giphy.gif?cid=790b7611l0m39x72czw6khhd233fgtoif51e2oqd841nvh6i&ep=v1_gifs_search&rid=giphy.gif&ct=g",
        "more_images": [
            "https://i.guim.co.uk/img/media/2ce8db064eabb9e22a69cc45a9b6d4e10d595f06/392_612_4171_2503/master/4171.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=45b5856ba8cd83e6656fbe5c166951a4",
            "https://m.media-amazon.com/images/I/41iCDvvHU5L._SR290,290_.jpg"
        ],
        "in_stock": 15,
        "trending": True
    },
    {
        "name": "Wireless Headphones",
        "category": "Electronics",
        "description": "High quality sound with noise-cancellation.",
        "price": 199.99,
        "image": "https://media.giphy.com/media/3oKIPabx4BDZWV8oIE/giphy.gif?cid=790b7611sx554r7dirnh8exg270vszhs1i7zq8cgc91wn8vc&ep=v1_gifs_search&rid=giphy.gif&ct=g",
        "more_images": [
            "https://accessworld.in/cdn/shop/files/BeatsSolo4SlateBlue_1.jpg?v=1724656316&width=1200",
            "https://honeywellconnection.com/in/wp-content/uploads/2024/08/01-8.jpg"
        ],
        "in_stock": 10,
        "trending": True
    },
    {
        "name": "Classic T-Shirt",
        "category": "Clothing",
        "description": "Comfortable cotton t-shirt available in various sizes.",
        "price": 29.99,
        "image": "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDd4ODZlaHJmZHhvcnAxdTJpMHZudzVkdHh2dXZhdzF1dXBnY2UwYSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3o6Mb7jQurR1B7mM5G/giphy.gif",
        "more_images": [
            "https://assets.ajio.com/medias/sys_master/root/20240125/Hguy/65b25dcd8cdf1e0df5d00253/-473Wx593H-469233373-black-MODEL.jpg",
            "https://assets.myntassets.com/dpr_1.5,q_60,w_400,c_limit,fl_progressive/assets/images/30292225/2024/7/22/347ab10a-904e-4880-9bda-77a505e336851721626712408TheRoadsterLifestyleCoPrintedCottonOversizedTshirts1.jpg"
        ],
        "in_stock": 25,
        "trending": False
    },
    {
        "name": "Your Books",
        "category": "Books",
        "description": "A page-turner mystery novel full of suspense.",
        "price": 14.99,
        "image": "https://media.giphy.com/media/NSqO1g7EUsw3cELJh4/giphy.gif?cid=790b7611fn1j6y0apuquzmwkp044x3acl91tzgxjc0a1s22z&ep=v1_gifs_search&rid=giphy.gif&ct=g",
        "more_images": [
            "https://images.squarespace-cdn.com/content/v1/5876279bbebafb82a7c81c00/f4e17d6a-81db-4a04-9bda-63c86c517778/IMG_3105.jpg",
            "https://benthambooks.com/slider-books/9789815179361.png"
        ],
        "in_stock": 5,
        "trending": False
    },
    {
        "name": "Running Shoes",
        "category": "Clothing",
        "description": "Lightweight and durable running shoes.",
        "price": 89.99,
        "image": "https://media.giphy.com/media/J18kU3PUixx64GlBWD/giphy.gif?cid=790b7611ntkcgixvwr4lpf8f5wjyows66nik4mdevh7uw71m&ep=v1_gifs_search&rid=giphy.gif&ct=g",
        "more_images": [
            "https://cdn.thewirecutter.com/wp-content/media/2024/11/runningshoes-2048px-09528.jpg",
            "https://uspoloassn.in/cdn/shop/files/1_b68e6977-de25-4a06-a361-c46195beced9.jpg"
        ],
        "in_stock": 8,
        "trending": False
    },
    {
        "name": "Smartphone X12",
        "category": "Electronics",
        "description": "Latest smartphone with 5G connectivity and 128GB storage.",
        "price": 799.99,
        "image": "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2swaHhjMnBzY2doajU5cHdraHNtczRqZWt2NjBvZnB0dTgxZ3QwYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26uf8Q4SbEs8AKe88/giphy.gif",
        "more_images": [
            "https://store.ulefone.com/cdn/shop/files/Ulefone_Armor_X12pro_Rugged_Smartphone.jpg?v=1729505826&width=1500",
            "https://image.made-in-china.com/2f0j00GescUdTMnLkb/Ulefone-Armor-X12-PRO-5-45-Inch-IP69K-Rugged-Smart-Mobile-Phone.webp"
        ],
        "in_stock": 12,
        "trending": True
    },
    {
        "name": "Gaming Laptop",
        "category": "Computers",
        "description": "High-performance gaming laptop with RTX 4060 GPU.",
        "price": 1299.99,
        "image": "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGxvZnR1cDNrN3RjbTk0NjhrNnkybDU4d2VqOWdnbjdnODhxbDI4dyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/B3WNliVIhP7ZQ42HIx/giphy.gif",
        "more_images": [
            "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/g-series/g16-7630/pdp/laptop-g16-7630-intel-pdp-hero.psd?qlt=95&fit=constrain,1&hei=400&wid=570&fmt=png-alpha",
            "https://i.pcmag.com/imagery/roundups/01hiB08j7yaJGJmPl2YhRRH-59..v1713199550.jpg"
        ],
        "in_stock": 7,
        "trending": True
    },
    {
        "name": "Bluetooth Speaker",
        "category": "Audio",
        "description": "Portable Bluetooth speaker with 24-hour battery life.",
        "price": 59.99,
        "image": "https://media.giphy.com/media/3ov9k3ul7jwt35uKgE/giphy.gif?cid=790b7611icvkzh0yln8n8pfdyqhbplehgm8g9pbbpxavfgrp&ep=v1_gifs_search&rid=giphy.gif&ct=g",
        "more_images": [
            "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1730270851/Croma%20Assets/Communication/Speakers%20and%20Media%20Players/Images/302520_0_i6w3cz.png?tr=w-600",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQcnP8Qs4001soRYK8ETYQUUQBIuShrYSVBw&s"
        ],
        "in_stock": 20,
        "trending": False
    },
    {
        "name": "Smart Watch",
        "category": "Wearable Tech",
        "description": "Fitness tracker with heart rate monitor and GPS.",
        "price": 199.99,
        "image": "https://media.giphy.com/media/lhRCP8SV1OmCL5OBLY/giphy.gif?cid=790b7611a9ywp3f1qn3enlu9k4kizhk3bddy3d27uyg0pz0n&ep=v1_gifs_search&rid=giphy.gif&ct=g",
        "more_images": [
            "https://www.titan.co.in/on/demandware.static/-/Sites-titan-master-catalog/default/dw97e0be58/images/Titan/Catalog/90165AP04_1.jpg",
            "https://hmadmin.hamleys.in/product/493174788/665/493174788-1.jpg"
        ],
        "in_stock": 18,
        "trending": True
    },
    {
        "name": "Backpack",
        "category": "Accessories",
        "description": "Waterproof and durable backpack with laptop compartment.",
        "price": 49.99,
        "image": "https://media.giphy.com/media/V8bL2GDVypk2eo1VLD/giphy.gif?cid=ecf05e47aor6renv7psubhnbt7kqzk6zin12ct3olcaz5x2p&ep=v1_gifs_search&rid=giphy.gif&ct=g",
        "more_images": [
            "https://icon.in/cdn/shop/files/1_f4e239e5-e089-4185-98fd-8fd7238275fe.jpg?v=1735286514",
            "https://cdn.thewirecutter.com/wp-content/media/2022/09/backpacks-2048px.jpg?auto=webp&quality=75&width=1024"
        ],
        "in_stock": 30,
        "trending": False
    },
    {
        "name": "Mechanical Keyboard",
        "category": "Computers",
        "description": "RGB mechanical keyboard with customizable keys.",
        "price": 129.99,
        "image": "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2ExNW0xMGFxMzg1dTQ0czVrbnRlb2F1ZGc3ZDJkd3JsYTByZTZjcCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ggW2m1m7uygs8/giphy.gif",
        "more_images": [
            "https://b3929379.smushcdn.com/3929379/wp-content/uploads/2023/01/Keychron-V3-Custom-Mechanical-Keyboard-knob-carbon-black-QMK-VIA-tenkeyless-hot-swappable-Keychron-K-Pro-switch-blue-V3-D2_540x.jpg?lossy=1&strip=1&webp=1",
            "https://ninjadog.in/wp-content/uploads/2023/06/varna_pro.webp"
        ],
        "in_stock": 5,
        "trending": True
    },
    {
        "name": "LED Monitor 27-inch",
        "category": "Computers",
        "description": "4K Ultra HD monitor with 144Hz refresh rate.",
        "price": 349.99,
        "image": "https://media.giphy.com/media/PMj971OjHZytCpSMIf/giphy.gif?cid=ecf05e47bj4bak7w9ev1oqif6pftoy3rr3g3ukbxunfraudy&ep=v1_gifs_search&rid=giphy.gif&ct=g",
        "more_images": [
            "https://m.media-amazon.com/images/I/611hXV-ZvaL.jpg",
            "https://www.primeabgb.com/wp-content/uploads/2023/10/Dell-27-inch-S2721Hm-S-Series-Monitor.jpg"
        ],
        "in_stock": 12,
        "trending": True
    },
    {
        "name": "Coffee Maker",
        "category": "Home Appliances",
        "description": "Automatic coffee maker with milk frother.",
        "price": 99.99,
        "image": "https://media.giphy.com/media/qBERw8Vtl70as9ZGLj/giphy.gif?cid=790b7611l0m39x72czw6khhd233fgtoif51e2oqd841nvh6i&ep=v1_gifs_search&rid=giphy.gif&ct=g",
        "more_images": [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuPEbUfvm5aA6W71_nUgPoBN5dRAjvyzmtjw&s",
            "https://i.guim.co.uk/img/media/2ce8db064eabb9e22a69cc45a9b6d4e10d595f06/392_612_4171_2503/master/4171.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=45b5856ba8cd83e6656fbe5c166951a4"
        ],
        "in_stock": 25,
        "trending": False
    },
    {
        "name": "Blender",
        "category": "Home Appliances",
        "description": "High-speed blender for smoothies and shakes.",
        "price": 49.99,
        "image": "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmltaWpsd3UwY292eGNxeDBzbXY2bjFicjA1ZTV3eGpwZW4wYmhqeSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xTiQytOEqr2U33lYkg/giphy.gif",
        "more_images": [
            "https://example.com/blender-side.jpg",
            "https://example.com/blender-top.jpg"
        ],
        "in_stock": 8,
        "trending": False
    },
    {
        "name": "Air Fryer",
        "category": "Home Appliances",
        "description": "Oil-free air fryer for healthier cooking.",
        "price": 89.99,
        "image": "https://media.giphy.com/media/U51rrO0K1Lw4qLExWc/giphy.gif?cid=790b7611cppjli8hc2iud2ti8gzk5355ln6vqghjh5zczg76&ep=v1_gifs_search&rid=giphy.gif&ct=g",
        "more_images": [
            "https://example.com/air-fryer-side.jpg",
            "https://example.com/air-fryer-front.jpg"
        ],
        "in_stock": 15,
        "trending": True
    },
    {
        "name": "Toaster",
        "category": "Home Appliances",
        "description": "2-slice toaster with browning control.",
        "price": 29.99,
        "image": "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnYwODY5cWt1OTE1ZmIzcms0ODl1N2h1eWc0NTh5NHM1ZmYxa2J4OCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26uf0NdX2Y21ZRmFO/giphy.gif",
        "more_images": [
            "https://example.com/toaster-side.jpg",
            "https://example.com/toaster-top.jpg"
        ],
        "in_stock": 20,
        "trending": False
    },
    {
        "name": "Rice Cooker",
        "category": "Home Appliances",
        "description": "Automatic rice cooker with keep-warm function.",
        "price": 39.99,
        "image": "https://media.giphy.com/media/GsFN3CUWikCa9y57x6/giphy.gif?cid=790b7611hq5jaegi7nvhbg8udhz3hg3mtebq96s02nlju89e&ep=v1_gifs_search&rid=giphy.gif&ct=g",
        "more_images": [
            "https://example.com/cooker-side.jpg",
            "https://example.com/cooker-front.jpg"
        ],
        "in_stock": 18,
        "trending": False
    }
]


with app.app_context():
    # Check if any products already exist.
    if Product.query.count() > 0:
        print("Products already exist. Skipping seeding.")
    else:
        for prod in sample_products:
            new_product = Product(
                name=prod["name"],
                category=prod["category"],
                description=prod["description"],
                price=prod["price"],
                image=prod["image"],
                more_images=prod.get("more_images"),
                in_stock=prod.get("in_stock", 0),
                trending=prod.get("trending", False)
            )
            db.session.add(new_product)
        db.session.commit()
        print("Database seeded with sample products!")

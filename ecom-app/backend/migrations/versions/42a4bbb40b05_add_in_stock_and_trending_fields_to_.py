"""Add in_stock and trending fields to Product model

Revision ID: 42a4bbb40b05
Revises: 1b72943d7a73
Create Date: 2025-XX-XX XX:XX:XX.XXXXXX

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '42a4bbb40b05'
down_revision = '1b72943d7a73'
branch_labels = None
depends_on = None

def upgrade():
    # Step 1: Add columns as nullable with a temporary default.
    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.add_column(sa.Column('in_stock', sa.Integer(), nullable=True, server_default='0'))
        batch_op.add_column(sa.Column('trending', sa.Boolean(), nullable=True, server_default='false'))
    
    # Step 2: Update existing rows to have the default values (this might be redundant because of server_default)
    op.execute("UPDATE product SET in_stock = 0 WHERE in_stock IS NULL")
    op.execute("UPDATE product SET trending = false WHERE trending IS NULL")
    
    # Step 3: Alter the columns to be non-nullable and remove the server default.
    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.alter_column('in_stock', nullable=False, server_default=None)
        batch_op.alter_column('trending', nullable=False, server_default=None)

def downgrade():
    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.drop_column('in_stock')
        batch_op.drop_column('trending')

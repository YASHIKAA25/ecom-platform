"""Add category to Product model

Revision ID: 1cec63132efa
Revises: 68a84977a8d5
Create Date: 2025-02-28 12:02:42.198817

"""
from alembic import op
import sqlalchemy as sa

revision = '1cec63132efa'
down_revision = '68a84977a8d5'
branch_labels = None
depends_on = None

def upgrade():
    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.add_column(sa.Column('category', sa.String(length=80), nullable=True))
    op.execute("UPDATE product SET category = 'Uncategorized' WHERE category IS NULL")
    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.alter_column('category', nullable=False)

def downgrade():
    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.drop_column('category')

"""Add shipping details to Order model

Revision ID: d4891c8f00e0
Revises: 1cec63132efa
Create Date: 2025-02-28 15:15:01.862724

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd4891c8f00e0'
down_revision = '1cec63132efa'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('order', schema=None) as batch_op:
        batch_op.add_column(sa.Column('shipping_name', sa.String(length=120), nullable=False, server_default='Unknown'))
        batch_op.add_column(sa.Column('shipping_address', sa.Text(), nullable=False, server_default='Unknown'))
        batch_op.add_column(sa.Column('shipping_email', sa.String(length=120), nullable=False, server_default='unknown@example.com'))
    # Remove server defaults if desired:
    with op.batch_alter_table('order', schema=None) as batch_op:
        batch_op.alter_column('shipping_name', server_default=None)
        batch_op.alter_column('shipping_address', server_default=None)
        batch_op.alter_column('shipping_email', server_default=None)

def downgrade():
    with op.batch_alter_table('order', schema=None) as batch_op:
        batch_op.drop_column('shipping_name')
        batch_op.drop_column('shipping_address')
        batch_op.drop_column('shipping_email')


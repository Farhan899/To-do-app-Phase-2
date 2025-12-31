"""add_priority_and_due_date_to_task

Revision ID: fcd120ceb03e
Revises: 001
Create Date: 2026-01-01 03:52:56.426708

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fcd120ceb03e'
down_revision: Union[str, None] = '001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add priority column
    op.add_column('tasks', sa.Column('priority', sa.String(length=20), nullable=True))
    # Add due_date column
    op.add_column('tasks', sa.Column('due_date', sa.String(length=10), nullable=True))


def downgrade() -> None:
    # Remove the columns
    op.drop_column('tasks', 'due_date')
    op.drop_column('tasks', 'priority')

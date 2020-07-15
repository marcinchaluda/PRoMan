from psycopg2.extras import RealDictCursor

import database_common


@database_common.connection_handler
def get_boards_data(cursor: RealDictCursor) -> list:
    """Get id of last added record"""

    query = """
                SELECT *  
                FROM boards
            """

    cursor.execute(query)

    return cursor.fetchall()


@database_common.connection_handler
def get_cards_data(cursor: RealDictCursor, board_id: int) -> list:
    """Get id of last added record"""

    cursor.execute("""
                SELECT *  
                FROM cards
                WHERE board_id = %(b_id)s
            """, {'b_id': board_id})

    return cursor.fetchall()


@database_common.connection_handler
def add_new_board(cursor: RealDictCursor, board_title: str):
    """Add new board to database"""

    cursor.execute("""
                INSERT INTO boards (title) 
                VALUES (%(b_title)s)
            """, {'b_title': board_title})

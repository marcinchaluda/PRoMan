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
def add_new_board(cursor: RealDictCursor, board_title: str):
    """Add new board to database"""

    cursor.execute("""
                INSERT INTO boards (title) 
                VALUES (%(b_title)s)
            """, {'b_title': board_title})


@database_common.connection_handler
def add_new_card(cursor: RealDictCursor, card_data: dict):
    """Add new card to database"""

    cursor.execute("""
                INSERT INTO cards (title, board_id, status_id) 
                VALUES (%(c_title)s, %(c_board_id)s, %(c_status)s)
            """, {'c_title': card_data['title'], 'c_board_id': card_data['boardId'], 'c_status': card_data['statusId']})

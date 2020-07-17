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
                ORDER BY status_id, order_number
            """, {'b_id': board_id})

    return cursor.fetchall()


@database_common.connection_handler
def add_new_board(cursor: RealDictCursor, board_title: str) -> dict:
    """Add new board to database"""

    cursor.execute("""
                INSERT INTO boards (title) 
                VALUES (%(b_title)s)
                RETURNING id
            """, {'b_title': board_title})

    return cursor.fetchone()


@database_common.connection_handler
def add_new_card(cursor: RealDictCursor, card_data: dict) -> dict:
    """Add new card to database"""

    # TODO Refactor code, extract inner queries to functions
    cursor.execute("""
    INSERT INTO cards (title, board_id, status_id, order_number) 
    VALUES (%(c_title)s, %(c_board_id)s, %(c_status)s, 
        (SELECT CASE
            WHEN (SELECT COUNT(*) FROM cards WHERE board_id = %(c_board_id)s AND status_id = 0) > 0 
                THEN (SELECT MAX(order_number) + 1 FROM cards WHERE status_id = 0 AND board_id = %(c_board_id)s)
            ELSE 0
        END))
    RETURNING id, order_number
            """, {'c_title': card_data['title'], 'c_board_id': card_data['boardId'], 'c_status': card_data['statusId']})

    return cursor.fetchone()


@database_common.connection_handler
def update_card_position(cursor: RealDictCursor, card_position: dict):
    """Update card position"""

    cursor.execute("""
                UPDATE cards
                SET status_id = %(status_id)s, order_number = %(order_number)s
                WHERE id = %(id)s
                """, {"status_id": card_position["statusId"], "order_number": card_position["orderNumber"], "id": card_position["id"]})


@database_common.connection_handler
def update_card_order_number(cursor: RealDictCursor, card_id: int, order_number: int):
    cursor.execute("""
                UPDATE cards
                SET order_number = %(order_number)s
                WHERE id = %(id)s
                """, {"order_number": order_number, "id": card_id})

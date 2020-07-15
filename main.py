from flask import Flask, render_template, url_for, request
from util import json_response

import data_handler
import data_manager

app = Flask(__name__)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_manager.get_boards_data()


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_manager.get_cards_data(board_id)


@app.route("/save-new-board", methods=['POST'])
@json_response
def save_new_board():
    """
    Add new board to database
    """
    board_title = request.json
    print(board_title)
    data_manager.add_new_board(board_title)

    return {'status': 200}


@app.route("/save-new-card", methods=['POST'])
@json_response
def save_new_card():
    """
    Add new card to database
    """
    card_data = request.json

    data_manager.add_new_card(card_data)

    return {'status': 200}


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()

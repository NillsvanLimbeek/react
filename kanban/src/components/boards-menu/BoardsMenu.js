import React, { useState, useEffect, Fragment } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import './BoardsMenu.scss';

import { SideMenu } from '../side-menu/SideMenu';
import { Search } from '../search/Search';
import { BoardListButton } from '../board-list-button/BoardListButton';
import { Modal } from '../modal/Modal';
import { ModalCenter } from '../modal/ModalCenter';
import { AddBoard } from '../forms/AddBoard';

export const BoardsMenu = ({ boards }) => {
    const [sideMenu, setSideMenu] = useState(false);
    const [search, setSearch] = useState('');
    const [filtererdBoards, setFilteredBoards] = useState([]);
    const [favoriteBoards, setfavoriteBoards] = useState([]);
    const [modal, setModal] = useState(false);

    const history = useHistory();
    const location = useLocation();

    // search for boards
    useEffect(() => {
        setFilteredBoards(
            boards.filter((board) => board.title.includes(search)),
        );

        return () => setFilteredBoards([]);
    }, [search, boards]);

    // favorite boards
    useEffect(() => {
        const favoriteBoards = boards.filter((board) => board.favorite);

        if (favoriteBoards.length) {
            setfavoriteBoards(favoriteBoards);
        }
    }, [boards]);

    const redirectToBoard = (id) => {
        location.pathname.includes('board')
            ? history.push(`${id}`)
            : history.push(`board/${id}`);

        setSideMenu(false);
        setSearch('');
    };

    const openModal = () => {
        setSideMenu(false);
        setModal(true);
    };

    const onAddBoard = (board) => {
        setModal(false);
        redirectToBoard(board.id);
    };

    return (
        <div className="boards-menu">
            <div
                className="boards-menu__button"
                onClick={() => setSideMenu(true)}
            >
                <i className="boards-menu__icon fas fa-th" />
                <p className="boards-menu__title">Boards</p>
            </div>

            {sideMenu && (
                <SideMenu closeSideMenu={() => setSideMenu(false)}>
                    <div className="boards-menu__menu">
                        <Search search={search} onSearch={setSearch} />

                        {favoriteBoards.length > 0 && (
                            <Fragment>
                                <h3>Favorite Boards</h3>

                                {favoriteBoards.map((board) => (
                                    <BoardListButton
                                        board={board}
                                        key={board.id}
                                        redirectTo={redirectToBoard}
                                    />
                                ))}
                            </Fragment>
                        )}

                        <Fragment>
                            <h3>Personal Boards</h3>

                            {filtererdBoards.map((board) => (
                                <BoardListButton
                                    board={board}
                                    key={board.id}
                                    redirectTo={redirectToBoard}
                                />
                            ))}

                            <div
                                className="boards-menu__add"
                                onClick={openModal}
                            >
                                <i className="fas fa-plus"></i> Add Board
                            </div>
                        </Fragment>
                    </div>
                </SideMenu>
            )}

            {modal && (
                <Modal>
                    <ModalCenter closeModal={() => setModal(false)}>
                        <AddBoard onAddBoard={onAddBoard} />
                    </ModalCenter>
                </Modal>
            )}
        </div>
    );
};

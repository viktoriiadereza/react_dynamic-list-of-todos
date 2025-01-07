import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';

import { getTodos, getUser } from './api';

import { Todo } from './types/Todo';
import { User } from './types/User';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodosState] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    setLoading(true);
    getTodos()
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
        setFilteredTodosState(fetchedTodos);
      })
      .catch(() => {
        // Обробка помилок
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const newFilteredTodos = todos.filter(todo => {
      const matchesQuery = todo.title
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesStatus =
        status === 'all' ||
        (status === 'completed' && todo.completed) ||
        (status === 'active' && !todo.completed);

      return matchesQuery && matchesStatus;
    });

    setFilteredTodosState(newFilteredTodos);
  }, [query, status, todos]);

  const handleShowModal = (todo: Todo) => {
    setSelectedTodo(todo);
    setLoadingUser(true);
    getUser(todo.userId)
      .then(fetchedUser => {
        setUser(fetchedUser);
      })
      .catch(() => {
        // Обробка помилок
      })
      .finally(() => {
        setLoadingUser(false);
      });
  };

  const handleCloseModal = () => {
    setSelectedTodo(null);
    setUser(null);
  };

  const handleFilterChange = ({
    query: newQuery,
    status: newStatus,
  }: {
    query: string;
    status: string;
  }) => {
    setQuery(newQuery);
    setStatus(newStatus);
  };

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter onFilterChange={handleFilterChange} />
            </div>

            <div className="block">
              {loading ? (
                <Loader />
              ) : (
                <TodoList
                  todos={filteredTodos}
                  selectedTodo={selectedTodo}
                  onTodoClick={handleShowModal}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedTodo && (
        <TodoModal
          todo={selectedTodo}
          user={user}
          loadingUser={loadingUser}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

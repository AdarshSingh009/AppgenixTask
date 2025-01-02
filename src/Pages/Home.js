import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", body: "", userId: "" });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const POSTS_PER_PAGE = 5;

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts",
        {
          params: {
            _page: currentPage,
            _limit: POSTS_PER_PAGE,
            _sort: sortBy,
            _order: "asc",
            q: searchQuery,
          },
        }
      );

      setPosts(response.data);
      setTotalPages(
        Math.ceil(response.headers["x-total-count"] / POSTS_PER_PAGE)
      );
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleCreatePost = async () => {
    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        {
          title: newPost.title,
          body: newPost.body,
          userId: 1,
        }
      );
      setPosts([...posts, response.data]);
      setNewPost({ title: "", body: "" });
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleUpdatePost = async () => {
    try {
      const response = await axios.put(
        `https://jsonplaceholder.typicode.com/posts/${editPostId}`,
        {
          title: newPost.title,
          body: newPost.body,
        }
      );
      setPosts(
        posts.map((post) => (post.id === editPostId ? response.data : post))
      );
      setNewPost({ title: "", body: "" });
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      handleUpdatePost();
    } else {
      handleCreatePost();
    }
  };

  const handleEditPost = (post) => {
    setNewPost({ title: post.title, body: post.body });
    setEditPostId(post.id);
    setIsEditMode(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, sortBy, searchQuery]);
  return (
    <div className="container">
      <h2>Welcome to the Home Page</h2>
      <button className="btn btn-danger" onClick={handleLogout}>
        Logout
      </button>

      <form onSubmit={handleSubmit} className="form-container">
        <h3>{isEditMode ? "Edit Post" : "Create New Post"}</h3>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            placeholder="Post title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="body" className="form-label">
            Body
          </label>
          <textarea
            className="form-control"
            id="body"
            placeholder="Post content"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="body" className="form-label">
            ID
          </label>
          <textarea
            className="form-control"
            id="id"
            placeholder="Post content"
            value={newPost.userId}
            onChange={(e) => setNewPost({ ...newPost, userId: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {isEditMode ? "Update Post" : "Create Post"}
        </button>
      </form>

      <h3>Posts</h3>

      {/* Search and Sorting */}
      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-3"
          placeholder="Search by title or body"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <select className="form-select" onChange={handleSortChange}>
          <option value="title">Sort by Title</option>
          <option value="body">Sort by Body</option>
          <option value="id">Sort by ID</option>
        </select>
      </div>

      {/* Posts Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Title</th>
            <th scope="col">Body</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>{post.title}</td>
              <td>{post.body}</td>
              <td>
                <button
                  className="btn btn-info"
                  onClick={() => handleEditPost(post)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeletePost(post.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          className="btn btn-secondary"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="mx-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-secondary"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;

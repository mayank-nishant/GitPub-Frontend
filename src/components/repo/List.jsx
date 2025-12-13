import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RepoList = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch(`http://localhost:3000/repo/user/${userId}`);
        const data = await res.json();
        setRepos(data.repositories || data || []);
      } catch (err) {
        console.error("Error fetching repos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, [userId]);

  if (loading)
    return (
      <div className="repo-list">
        {[1, 2, 3].map((i) => (
          <div key={i} className="repo-card skeleton">
            <div className="skeleton-title" />
            <div className="skeleton-line" />
          </div>
        ))}
      </div>
    );
  if (!repos || repos.length === 0) return <div>No repositories found.</div>;

  return (
    <div className="page-wrapper">
      <div className="repo-list">
        {repos.map((r) => (
          <div key={r._id || r.id || r.name} className="repo-card">
            <Link to={`/repo/${r._id || r.id}`}>
              <h3>{r.name}</h3>
            </Link>
            <p>{r.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepoList;

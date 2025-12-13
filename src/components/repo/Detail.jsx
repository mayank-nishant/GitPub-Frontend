import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RepoDetail = () => {
  const { id } = useParams();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const res = await fetch(`http://localhost:3000/repo/${id}`);
        const data = await res.json();
        // API may return array or object
        setRepo(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        console.error("Error fetching repo", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRepo();
  }, [id]);

  if (loading)
    return (
      <div className="repo-detail">
        <div className="skeleton-title" style={{ width: 240, height: 28 }} />
        <div className="skeleton-line" style={{ width: "80%", height: 16, marginTop: 12 }} />
      </div>
    );
  if (!repo) return <div>Repository not found.</div>;

  return (
    <div className="page-wrapper">
      <div className="repo-detail">
        <h2>{repo.name}</h2>
        <p>{repo.description}</p>
        <div className="repo-content">{repo.content && repo.content.length > 0 ? repo.content.map((c, idx) => <pre key={idx}>{c}</pre>) : <div>No content available</div>}</div>
      </div>
    </div>
  );
};

export default RepoDetail;

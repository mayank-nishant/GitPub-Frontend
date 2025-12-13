import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const IssueList = ({ repoId }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const id = repoId || params.id;

  useEffect(() => {
    if (!id) return setLoading(false);
    const fetchIssues = async () => {
      try {
        const res = await fetch(`http://localhost:3000/issue/all?id=${id}`);
        // backend expects route /issue/all (no repo filter) or /issue/:id — try /issue/:id
        const res2 = await fetch(`http://localhost:3000/issue/${id}`);
        const data = await res2.json();
        setIssues(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error("Error fetching issues", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [id]);

  if (loading)
    return (
      <div className="issue-list">
        {[1, 2].map((i) => (
          <div key={i} className="issue-card skeleton">
            <div className="skeleton-title" />
            <div className="skeleton-line" />
          </div>
        ))}
      </div>
    );
  if (!issues || issues.length === 0) return <div>No issues found.</div>;

  return (
    <div className="page-wrapper">
      <div className="issue-list">
        {issues.map((iss) => (
          <div key={iss._id || iss.id} className="issue-card">
            <Link to={`/issue/${iss._id || iss.id}`}>
              <h4>{iss.title}</h4>
            </Link>
            <p>{iss.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IssueList;

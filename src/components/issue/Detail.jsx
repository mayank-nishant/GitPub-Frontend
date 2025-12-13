import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const IssueDetail = () => {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await fetch(`http://localhost:3000/issue/${id}`);
        const data = await res.json();
        setIssue(data);
      } catch (err) {
        console.error("Error fetching issue", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

  if (loading)
    return (
      <div className="issue-detail">
        <div className="skeleton-title" style={{ width: 220, height: 24 }} />
        <div className="skeleton-line" style={{ width: "70%", height: 12, marginTop: 8 }} />
      </div>
    );
  if (!issue) return <div>Issue not found.</div>;

  return (
    <div className="page-wrapper">
      <div className="issue-detail">
        <h3>{issue.title}</h3>
        <p>{issue.description}</p>
        <p>Status: {issue.status}</p>
      </div>
    </div>
  );
};

export default IssueDetail;

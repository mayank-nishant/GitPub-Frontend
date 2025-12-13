import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [liveMessage, setLiveMessage] = useState("");

  const navigate = useNavigate();
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    let mounted = true;

    const fetchRepositories = async () => {
      try {
        setLoading(true);
        const resp1 = await fetch(`http://localhost:3000/repo/user/${userId}`);
        const data1 = await resp1.json();
        const resp2 = await fetch(`http://localhost:3000/repo/all`);
        const data2 = await resp2.json();
        if (!mounted) return;
        setRepositories(data1.repositories || data1 || []);
        setSuggestedRepositories(data2 || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load repositories");
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
    return () => {
      mounted = false;
    };
  }, []);

  // combine and dedupe
  const combinedRepos = useMemo(() => {
    const map = new Map();
    const push = (r) => {
      if (!r) return;
      const id = r._id || r.id || r.name;
      if (!map.has(id)) map.set(id, r);
    };
    (suggestedRepositories || []).forEach(push);
    (repositories || []).forEach(push);
    return Array.from(map.values());
  }, [repositories, suggestedRepositories]);

  const filteredResults = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === "") return combinedRepos;
    const q = searchQuery.toLowerCase();
    return combinedRepos.filter((repo) => {
      const name = (repo.name || "").toLowerCase();
      const desc = (repo.description || "").toLowerCase();
      const owner = (repo.owner || repo.username || "").toString().toLowerCase();
      return name.includes(q) || desc.includes(q) || owner.includes(q);
    });
  }, [searchQuery, combinedRepos]);

  const onSelectRepo = (repo) => {
    const id = repo._id || repo.id || repo.repoId;
    if (id) navigate(`/repo/${id}`);
    else console.log("selected repo", repo);
    setShowResults(false);
    setSelectedIndex(-1);
  };

  const onKeyDown = (e) => {
    if (!showResults) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1 >= filteredResults.length ? 0 : i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 < 0 ? Math.max(filteredResults.length - 1, 0) : i - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setSelectedIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setSelectedIndex(filteredResults.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const repo = filteredResults[selectedIndex >= 0 ? selectedIndex : 0];
      if (repo) onSelectRepo(repo);
    } else if (e.key === "Escape") {
      setShowResults(false);
    }
  };

  // click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // global '/' keyboard shortcut to focus the search input
  useEffect(() => {
    const handler = (e) => {
      // only when plain '/' is pressed and not while typing in an input
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const active = document.activeElement;
        const tag = active && active.tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA" && !active?.isContentEditable) {
          e.preventDefault();
          inputRef.current && inputRef.current.focus();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // update ARIA live message when results or selection change
  useEffect(() => {
    if (!showResults || !searchQuery || searchQuery.trim() === "") {
      setLiveMessage("");
      return;
    }
    if (loading) {
      setLiveMessage("Searching...");
      return;
    }
    if (error) {
      setLiveMessage("Search error");
      return;
    }
    const count = filteredResults.length;
    if (count === 0) setLiveMessage(`No results for "${searchQuery}"`);
    else setLiveMessage(`${count} result${count === 1 ? "" : "s"} for "${searchQuery}"`);
  }, [filteredResults.length, selectedIndex, showResults, searchQuery, loading, error]);

  return (
    <div className="page-wrapper dashboard-root" ref={containerRef}>
      <section className="dashboard-search">
        <input
          ref={inputRef}
          className="search-input"
          aria-label="Search repositories"
          type="search"
          placeholder={loading ? "Loading..." : "Search repositories, owners, descriptions..."}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setShowResults(true)}
          onKeyDown={onKeyDown}
        />

        {showResults && (
          <>
            <div role="listbox" className="search-results">
              {loading ? (
                <div className="search-result-item">Loading...</div>
              ) : error ? (
                <div className="search-result-item">Error: {error}</div>
              ) : filteredResults.length === 0 ? (
                <div className="search-result-item">No results found</div>
              ) : (
                filteredResults.map((repo, idx) => (
                  <div role="option" aria-selected={selectedIndex === idx} key={repo._id || repo.id || repo.name} className={`search-result-item ${selectedIndex === idx ? "selected" : ""}`} onMouseDown={() => onSelectRepo(repo)} onMouseEnter={() => setSelectedIndex(idx)}>
                    <div className="result-title">{repo.name || repo.title || "Untitled"}</div>
                    <div className="result-sub">{repo.description || repo.desc || ""}</div>
                  </div>
                ))
              )}
            </div>

            {/* visually-hidden live region for screen readers */}
            <div
              aria-live="polite"
              aria-atomic="true"
              style={{
                position: "absolute",
                width: 1,
                height: 1,
                margin: -1,
                padding: 0,
                overflow: "hidden",
                clip: "rect(0 0 0 0)",
                border: 0,
              }}
            >
              {liveMessage}
            </div>
          </>
        )}
      </section>

      <section className="dashboard-content">
        <h2>Your Repositories</h2>
        {loading && <div>Loading repositories...</div>}
        {!loading && repositories.length === 0 && <div>No repositories yet</div>}
        <div className="repo-list">
          {(repositories || []).map((r) => (
            <div key={r._id || r.id || r.name} className="repo-card">
              <div className="repo-name">{r.name}</div>
              <div className="repo-desc">{r.description}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

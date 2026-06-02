import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mainProjects, otherProjects } from "../../data/projectsData.ts";
import "../../styles/Projects.css";

const GitHubIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const Projects = () => {
  const [showOthers, setShowOthers] = useState(false);
  const navigate = useNavigate();

  return (
    <section className="section" id="projects-section">
      <div className="projects-header">
        <h2 className="projects-title">Projects</h2>
        <div className="title-divider"></div>
      </div>

      <div className="main-projects">
        {mainProjects.map((project, idx) => (
          <div className="project-card" key={idx}>
            <div className="project-header">
              <div className="header-content">
                <h3 className="project-name">{project.title}</h3>
                <p className="project-meta">
                  {project.period} · {project.team} · {project.role}
                </p>
              </div>
              <div className="project-header-buttons">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="live-icon-button"
                    title="라이브 서비스"
                  >
                    <ExternalLinkIcon />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-icon-button"
                    title="GitHub 저장소"
                  >
                    <GitHubIcon />
                  </a>
                )}
                <button
                  className="project-detail-button"
                  onClick={() => navigate(`/projects/${project.name}`)}
                >
                  자세히 보기
                </button>
              </div>
            </div>

            <div className="project-body">
              <p className="project-description">{project.description}</p>
              <div className="tech-tags">
                {(project.tech ?? []).map((tech, i) => (
                  <span className="tech-tag" key={i}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="others-toggle">
        <button
          className="others-button"
          onClick={() => setShowOthers(!showOthers)}
        >
          {showOthers ? "− Other Projects" : "+ Other Projects"}
        </button>
      </div>

      {showOthers && (
        <div className="other-projects">
          {otherProjects.map((project, idx) => (
            <div className="other-project-item" key={idx}>
              <div className="other-project-info">
                <div className="other-project-top">
                  <h4 className="other-project-name">{project.title}</h4>
                  <span className="other-project-meta">
                    {project.period} · {project.team}
                  </span>
                </div>
                <p className="other-project-role">{project.role}</p>
                <p className="other-project-desc">{project.description}</p>
              </div>
              <button
                className="project-detail-button"
                onClick={() => navigate(`/projects/${project.name}`)}
              >
                자세히 보기
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Projects;

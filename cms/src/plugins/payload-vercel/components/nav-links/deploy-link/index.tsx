import React from "react";
import { NavLink } from "react-router-dom";
import { Chevron } from "payload/components/icons";

import "./index.scss";

interface DeployNavLinkProps {
  className?: string;
}

const DeployLink: React.FC<DeployNavLinkProps> = ({ className }) => {
  return (
    <div className="nav-group">
      <div className="nav-group__content">
        <NavLink to="/admin/deploy" className="nav__link">
          Manage Deployments
        </NavLink>
      </div>
    </div>
  );
};

export default DeployLink;

import { formatDistanceStrict, formatDistanceToNowStrict } from "date-fns";
import { Button, Eyebrow } from "payload/components/elements";
import { useStepNav } from "payload/components/hooks";
import { DefaultTemplate } from "payload/components/templates";
import { Meta, useConfig } from "payload/components/utilities";
import { AdminViewComponent, AdminViewProps } from "payload/config";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

import { PluginOptions } from "../../../types";
import "./index.scss";

const DeployView = ({
  user,
  canAccessAdmin,
  pluginOptions,
}: AdminViewProps & {
  pluginOptions: PluginOptions;
}): AdminViewComponent => {
  const {
    routes: { admin: adminRoute },
  } = useConfig();
  const { setStepNav } = useStepNav();

  // This effect will only run one time and will allow us
  // to set the step nav to display our custom route name

  useEffect(() => {
    setStepNav([
      {
        label: "Deploy",
      },
    ]);
  }, [setStepNav]);

  // If an unauthorized user tries to navigate straight to this page,
  // Boot 'em out
  if (!user || (user && !canAccessAdmin)) {
    // @ts-expect-error
    return <Redirect to={`${adminRoute}/unauthorized`} />;
  }

  const [isDeploying, setIsDeploying] = useState(false);
  const [isPolling, setIsPolling] = useState(true);

  const [data, setData] = useState({
    domains: [],
    deployments: [],
  });

  const fetchData = async () => {
    return (await fetch(`/api/vercel/deployments`)).json();
  };

  const pollData = async () => {
    if (isPolling) {
      const data = await fetchData();
      setData(data);

      /* Poll again in 5 seconds if any of the deployments are still building */
      if (
        data.deployments.some(
          (deployment) =>
            deployment.state === "BUILDING" ||
            deployment.state === "QUEUED" ||
            deployment.state === "INITIALIZING"
        )
      ) {
        setTimeout(pollData, 2500);
      } else {
        setIsPolling(false);
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (
        pluginOptions.vercelToken &&
        pluginOptions.vercelTeamId &&
        pluginOptions.vercelProjectId
      ) {
        await pollData();
      }
    })();
  }, [isPolling]);

  const handleClick = async (deployHookUrl) => {
    setIsDeploying(true);
    /* Deploy site on Vercel */
    const response = await fetch(deployHookUrl, {
      method: "POST",
    });

    /* Poll until complete */
    setIsPolling(true);

    /* Ensure we fetch latest */
    setTimeout(() => {
      setIsPolling(true);
      setIsDeploying(false);
    }, 1500);
  };

  const isPublishingDisabled =
    isDeploying ||
    data.deployments.some(
      (deployment) =>
        deployment.state === "BUILDING" ||
        deployment.state === "QUEUED" ||
        deployment.state === "INITIALIZING"
    );

  const [revalidationPath, setRevalidationPath] = useState("");
  const [isRevalidating, setIsRevalidating] = useState(false);
  async function handleRevalidate() {
    if (revalidationPath) {
      setIsRevalidating(true);
      const res = await (
        await fetch(`/api/vercel/revalidate`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paths: [...revalidationPath.split(",").map((p) => p.trim())],
          }),
        })
      ).json();
      console.log(`Response from manually revalidating ${revalidationPath}...`);
      console.log(res);
      setIsRevalidating(false);
      setRevalidationPath("");
    }
  }

  // @ts-expect-error
  return (
    <DefaultTemplate>
      <Meta
        title="Manage Deployments"
        description=""
        keywords=""
      />
      <div
        className="gutter--left gutter--right global-edit__edit"
        style={{
          marginTop: "0.9615384615rem",
        }}
      >
        <div className="deploy__section">
          <h1>Manage Deployments</h1>
          <p className="deploy__description">
            Pressing Save on any page should automatically send your changes to
            the live site the next time you refresh. However, this quick refresh
            is a new technology so if you're not seeing the latest content try
            the options below.
          </p>
        </div>

        <div className="deploy__section">
          <h2>Force Revalidation</h2>
          <p className="deploy__description">
            If you notice a specific page is not showing the latest content,
            enter the path (e.g. /about) here to force a revalidation of the
            page.
          </p>
          <div className="field-type text">
            <label className="field-label"></label>
            <input
              name="path"
              type="text"
              placeholder="/, /work/[slug], etc"
              onChange={(e) => setRevalidationPath(e.target.value)}
              value={revalidationPath}
            ></input>
            <Button
              onClick={handleRevalidate}
              className="deploy__button"
              disabled={isRevalidating}
            >
              {isRevalidating ? "Revalidating..." : "Revalidate Path"}
            </Button>
          </div>
        </div>
        {Array.isArray(pluginOptions.deployHooks) &&
          pluginOptions.deployHooks.length > 0 && (
            <div className="deploy__section">
              <h2>Rebuild & Deploy Site</h2>
              <p className="deploy__description">
                If you've tried the previous options and you're still not seeing
                the latest content, use the button(s) below to rebuild and
                deploy the site.
              </p>
              <div className="deploy__buttons">
                {
                  /* Render deploy buttons */
                  pluginOptions.deployHooks.map((deployHook, i) => {
                    return (
                      <Button
                        key={i}
                        onClick={() =>
                          handleClick(
                            deployHook.useBuildCache
                              ? deployHook.url
                              : `${deployHook.url}?buildCache=false`
                          )
                        }
                        disabled={isPublishingDisabled}
                        className="deploy__button"
                      >
                        {isPublishingDisabled
                          ? "Publishing..."
                          : deployHook.label}
                      </Button>
                    );
                  })
                }
              </div>
            </div>
          )}
        {/* Render latest deployments  */}
        {pluginOptions.vercelToken &&
          pluginOptions.vercelTeamId &&
          pluginOptions.vercelProjectId && (
            <>
              {" "}
              <h2>Latest Deployments</h2>
              <div className="deployments">
                {data.deployments.map((deployment, i) => {
                  let name = deployment.name,
                    branch = deployment.meta?.githubCommitRef;
                  if (deployment.meta?.githubCommitRef) {
                    const branch = deployment.meta.githubCommitRef;
                    const domain = data.domains.find(
                      (domain) => domain.gitBranch === branch
                    );
                    if (domain) {
                      name = domain.name;
                    }
                  }
                  /* Author is either Deploy Hook, if meta.deployHookId exists, otherwise it's githubCommitAuthorLogin */
                  const author = deployment.meta?.deployHookId
                    ? "via Deploy Hook"
                    : `by ${deployment.meta?.githubCommitAuthorLogin}`;

                  /* When ready, errored, or cancelled, show the duration of the build */
                  const buildDuration =
                    deployment.state === "READY" ||
                    deployment.state === "ERROR" ||
                    deployment.state === "CANCELED"
                      ? formatDistanceStrict(
                          deployment.ready,
                          deployment.buildingAt
                        )
                      : "";
                  return (
                    <DeploymentItem
                      key={i}
                      title={name}
                      subtitle={branch}
                      status={deployment.state}
                      buildDuration={buildDuration}
                      description={`${formatDistanceToNowStrict(
                        deployment.created
                      )} ago ${author}`}
                      commitMessage={deployment.meta?.githubCommitMessage}
                    />
                  );
                })}
              </div>
            </>
          )}
      </div>
    </DefaultTemplate>
  );
};

const DeploymentItem = ({
  title,
  subtitle,
  status,
  buildDuration,
  description,
  commitMessage,
}) => {
  return (
    <div className="deployment-item">
      <div className="deployment-item__header">
        <div className="deployment-item__title">{title}</div>
        <div className="deployment-item__subtitle">{subtitle}</div>
      </div>
      <div className="deployment-item__status">
        <div
          className="deployment-item__status-icon"
          style={{
            backgroundColor:
              status === "READY"
                ? "var(--color-success-400)"
                : status === "ERROR" || status === "CANCELED"
                ? "var(--color-error-400)"
                : "var(--color-warning-400)",
          }}
        />
        <div className="deployment-item__status-text">
          {status.toLowerCase()}
        </div>
        <div className="deployment-item__build-duration">{buildDuration}</div>
      </div>
      <div className="deployment-item__commit-message">{commitMessage}</div>
      <div className="deployment-item__description">{description}</div>
    </div>
  );
};

export default DeployView;

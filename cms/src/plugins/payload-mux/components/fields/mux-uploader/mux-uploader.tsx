import MuxUploader from "@mux/mux-uploader-react";
import React, { useCallback, useEffect, useState } from "react";

import MuxPlayer from "@mux/mux-player-react";
import { useForm, useFormFields } from "payload/components/forms";
import "./mux-uploader.scss";

const MuxUploaderField = () => {
  const [uploadId, setUploadId] = useState("");
  const { assetId, setAssetId, title, setTitle, file, setFile, playbackId } =
    useFormFields(([fields, dispatch]) => ({
      assetId: fields.assetId,
      setAssetId: (assetId: string) =>
        dispatch({ type: "UPDATE", path: "assetId", value: assetId }),
      title: fields.title,
      setTitle: (title: string) =>
        dispatch({ type: "UPDATE", path: "title", value: title }),
      file: fields.file,
      setFile: (file: File) =>
        dispatch({ type: "UPDATE", path: "file", value: file }),
      playbackId: fields.playbackId,
    }));

  const { submit, setProcessing } = useForm();

  const getSignedUrl = useCallback(async () => {
    const { id, url } = (await (
      await fetch(`/api/mux/upload`, {
        method: "post",
      })
    ).json()) as { id: string; url: string };
    setUploadId(id);
    return url;
  }, []);

  const onUploadStart = (args) => {
    console.log("onUploadStart");
    console.log(args);

    const {
      detail: { file },
    } = args;

    const resolvedTitle = title.value || file.name;

    if (!title.value) {
      setTitle(resolvedTitle);
    }

    setFile(
      new File([], resolvedTitle, {
        type: file.type,
        lastModified: file.lastModified,
      })
    );
  };

  const onSuccess = async (args) => {
    /* Show "Creating..." overlay */
    setProcessing(true);

    /* Args don't contain asset ID, so we need to fetch it from the server */
    console.log(`Args in onSuccess`);
    console.log(args);

    /* When the upload succeeded, get the Asset ID from the server */
    let upload = await (
      await fetch(`/api/mux/upload?id=${uploadId}`, {
        method: "get",
      })
    ).json();

    console.log(`First attempt fetching upload in onSuccess`);
    console.log(upload);

    /* Sometimes the upload doesn't have the asset_id yet, poll every second until it does (this should only take a moment) */
    while (!upload.asset_id) {
      console.log(`Polling for asset_id...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      upload = await (
        await fetch(`/api/mux/upload?id=${uploadId}`, {
          method: "get",
        })
      ).json();
      console.log(upload);
    }

    const { asset_id } = upload;

    /* Dispatch the ID field */
    setAssetId(asset_id);

    /* Submit the form, use timeout to ensure setAssetId has been handled */
    setTimeout(async () => {
      await submit({
        overrides: {
          assetId: asset_id,
        },
      });
    }, 0);
  };

  /* When this is rendered, ensure the default .file-field is hidden */
  /* We can't do this in CSS otherwise it hides .file-field(s) in other collections */
  useEffect(() => {
    if (window) {
      const fileField = document.querySelector(".file-field") as HTMLElement;
      if (fileField) {
        fileField.style.display = "none";
      }
    }
  }, []);

  //  There are three states: before upload, when we show the uploader. When the asset exists, we show the player. And when the asset is preparing, we show a message.
  return (
    <div className="mux-uploader">
      {!assetId.value && (
        <MuxUploader
          endpoint={getSignedUrl}
          onUploadStart={onUploadStart}
          onSuccess={onSuccess}
        ></MuxUploader>
      )}
      {assetId.value && !playbackId.value && (
        <div className="mux-uploader__processing">
          Video is being encoded. This typically takes less than 90 seconds,
          please refresh the page in a moment
        </div>
      )}
      {playbackId.value && (
        <MuxPlayer
          playbackId={playbackId.value as string}
          streamType="on-demand"
        />
      )}
    </div>
  );
};

export default MuxUploaderField;

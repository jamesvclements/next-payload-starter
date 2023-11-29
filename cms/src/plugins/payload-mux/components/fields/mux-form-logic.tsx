import React, { useEffect } from "react";
import { useFormFields } from "payload/components/forms";

export function MuxFormLogicField() {
  const file = useFormFields(([fields]) => fields.file);
  const { title, setTitle } = useFormFields(([fields, dispatch]) => ({
    title: fields.title,
    setTitle: (title: string) =>
      dispatch({ type: "UPDATE", path: "title", value: title }),
  }));

  useEffect(() => {
    /* When the file is picked, set the default title, if title hasn't been set already */
    if (file && file.value) {
      console.log("sbould be setting title");
      const currentFile = file.value as File;
      setTitle(currentFile.name);
    }
  }, [file]);

  return null;
}

/* Don't render this in the filter options */
export function MuxFormLogicFilter() {
  return <div>Testing</div>;
}

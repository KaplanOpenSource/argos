import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

export const VersionId = ({ }) => {
  const [commitId, setCommitId] = useState();
  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch("/commit.txt");
        if (resp.ok) {
          const com = await resp.text();
          setCommitId(com.slice(0, 7));
        } else {
          setCommitId('')
        }
      } catch (e) {
        // console.log(e);
        setCommitId('')
      }
    })();
  }, []);
  return (
    <Typography variant="body2"
      sx={{
        alignSelf: 'center',
        fontSize: 'xx-small',
      }}
    >
      version: {commitId}
    </Typography>
  )
}
import React, {useEffect} from "react";
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from "@mui/material/Typography";
import Link from '@mui/material/Link';


function Paragraph(props) {
  return (
    <Typography variant="body1" paragraph sx={{ml: 4}}> {props.children}</Typography >
  );
}

export function Download(props) {
  const {setTitle} = props;
  useEffect(() => {
    setTitle("Copy Mempool");
  }, []);
  return (
    <Container>
      <Typography variant="h2">Download this mempool</Typography>
      <Divider sx={{my: 3}} />
      <Paragraph>
        You can download this mempool and insert it into your Bitcoin node using the {" "}
        <Link href="https://github.com/dev7ba/mempool-client">mempool-client</Link> program. This allows an easy and fast syncronization of your just-started Bitcoin node.
      </Paragraph>
      <Paragraph>
        You can also configure your own {" "}
        <Link href="https://github.com/dev7ba/mempool-server">mempool-server</Link> {" "}
        so that other people can download your mempool.
      </Paragraph>
      <Paragraph>
        If you prefer to copy mempools between two nodes that you manage, maybe you would prefer using{" "}
        <Link href="https://github.com/dev7ba/mempoolcp">mempoolcp</Link>.
      </Paragraph>
      <Paragraph>
        This mempool uses full replace by fee (mempoolfullrbf=1).
      </Paragraph>

    </Container >
  );
}

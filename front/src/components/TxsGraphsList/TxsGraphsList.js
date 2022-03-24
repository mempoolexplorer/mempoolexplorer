import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {txMempoolPetitionTo} from "../../utils/utils";
import {TxsGraphTxList} from "./TxsGraphTxList"
import {emphasize, styled} from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import {TabPanel} from "../../utils/CommonComponents";
import LinearIcon from '@mui/icons-material/LinearScale';
import NonLinearIcon from '@mui/icons-material/Timeline';
import {GraphsArea} from "./GraphsArea";

export function TxsGraphsList(props) {
  const {setTitle} = props;
  const [txsGraphs, setTxsGraphs] = useState([]);
  const {index} = useParams();
  const [gIndex, setGIndex] = useState(index);
  const [tabValue, setTabValue] = React.useState(0);

  useEffect(() => {
    setTitle("Transactions Graphs");
    txMempoolPetitionTo("/miningQueueAPI/txGraphList", setTxsGraphs);
  }, []);

  const StyledTypo = styled(Typography)(({theme}) => {
    return {
      color: theme.palette.text.secondary
    };
  });

  const StyledBreadcrumb = styled(Chip)(({theme}) => {
    const backgroundColor =
      theme.palette.mode === 'light'
        ? theme.palette.grey[100]
        : theme.palette.grey[800];
    return {
      backgroundColor,
      height: theme.spacing(3),
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightRegular,
      '&:hover, &:focus': {
        backgroundColor: emphasize(backgroundColor, 0.06),
      },
      '&:active': {
        boxShadow: theme.shadows[1],
        backgroundColor: emphasize(backgroundColor, 0.12),
      },
    };
  });

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (txsGraphs === undefined) return null;
  else
    return (
      <div>
        <Breadcrumbs aria-label="breadcrumb" sx={{mb: 2}}>
          <StyledBreadcrumb
            label="Graphs"
            icon={<NonLinearIcon fontSize="small" />}
            onClick={() => {setGIndex(undefined)}}
          />
          {gIndex !== undefined && <StyledBreadcrumb
            label={"Graph #" + gIndex}
          />}
        </Breadcrumbs>

        {gIndex !== undefined && txsGraphs.length !== 0 && <TxsGraphTxList txSet={txsGraphs[gIndex]} id={gIndex} />}

        {gIndex === undefined && (
          <div>
            <Typography variant="h5" sx={{mb: 2}}>List of transaction dependency graphs currently in mempool:</Typography>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
              <Tabs centered value={tabValue} onChange={handleChange} aria-label="basic tabs example">
                <Tab icon={<NonLinearIcon />} iconPosition="start" label="Non-Linear" />
                <Tab icon={<LinearIcon />} iconPosition="start" label="Linear" />
              </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
              <Grid container justifyContent="center">
                <Grid item>
                  <StyledTypo>
                    A tx within graph has more than one ascendant or more than one descendant.
                  </StyledTypo>
                </Grid>
              </Grid>
              <GraphsArea txsGraphs={txsGraphs}
                filterFunc={(txG, i) => {txG.i = i; return txG.nonLinear;}}
                setGIndex={setGIndex} linear={false} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Grid container justifyContent="center">
                <Grid item>
                  <StyledTypo>
                    No tx within graph has more than one ascendant nor more than one descendant.
                  </StyledTypo >
                </Grid>
              </Grid>
              <GraphsArea txsGraphs={txsGraphs}
                filterFunc={(txG, i) => {txG.i = i; return !txG.nonLinear;}}
                setGIndex={setGIndex} linear={true} />
            </TabPanel>
          </div>
        )}
      </div>
    );
}

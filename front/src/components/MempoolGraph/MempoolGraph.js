import React, {useEffect, useState} from "react";
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import {Explanation} from "./Explanation/Explanation";
import "./MempoolGraph.css";
import {ForceGraph} from "./ForceGraph/ForceGraph";
import {ForceGraphHeader} from "./ForceGraph/ForceGraphHeader";
import {MempoolPanel} from "./Panels/MempoolPanel";
import {BlockPanel} from "./Panels/BlockPanel";
import {txMempoolPetitionTo} from "../../utils/utils";
import {TxIdBox} from "./TxIdBox/TxIdBox";
import {IgnoringBlocksSection} from "./IgnoringBlocksSection/IgnoringBlocksSection";
import {useMediaQuery} from 'react-responsive';
import {useWindowSize} from "../../hooks/windowSize";
import {
  dataForForceGraph,
} from "./dataCreation";
import {useParams} from "react-router-dom";
import {TxDetails} from "./TxDetails/TxDetails";
import {Position} from "./Position/Position";
import {TxsPanel} from "./Panels/TxsPanel";

export function MempoolGraph(props) {
  const {setTitle} = props;
  const [mempoolBy, setMempoolBy] = useState("byBoth");
  const [blockBy, setBlockBy] = useState("byBoth");
  const [txsBy, setTxsBy] = useState("byBoth");

  const [data, setData] = useState({txIdSelected: ""});
  const [invTx, setInvTx] = useState({});
  const [txIdNotFoundState, setTxIdNotFound] = useState(false);
  const [txIdTextState, setTxIdText] = useState("");
  const [lockMempool, setLockMempool] = useState(false);
  const [interactive, setInteractive] = useState(true);
  const [helpWanted, setHelpWanted] = useState(true);

  let {txId} = useParams();

  function mergeData(recvData) {
    recvData.tx = invTx;
    setData(recvData);
  }

  function extractInvTxAndSetData(recvData) {
    setInvTx(recvData.tx);
    setData(recvData);
  }

  //After each render, this method executes, whatever state changes
  useEffect(() => {
    setTitle("Mempool");
    const timerId = setInterval(() => updateDataByTimer(), 5000);
    return function cleanup() {
      clearInterval(timerId);
    };
  });

  //Only executed once at begining.
  useEffect(() => {
    // console.log(txId);
    if (txId !== undefined) {
      setHelpWanted(false);
      setTxIdText(txId);
      txMempoolPetitionTo("/miningQueueAPI/tx/" + txId, (incomingData) => {
        if (incomingData.txIdSelected === "") {
          setTxIdNotFound(true);
        }
        extractInvTxAndSetData(incomingData);
      });
    } else {
      txMempoolPetitionTo("/miningQueueAPI/miningQueue", setData);
    }
  }, [txId]);

  function updateDataByTimer() {
    if (lockMempool === true) return;
    if (data.txIdSelected !== "") {
      txMempoolPetitionTo(
        "/miningQueueAPI/txCached/" + data.txIdSelected,
        mergeData
      );
    } else if (data.blockSelected === -1) {
      txMempoolPetitionTo("/miningQueueAPI/miningQueue", setData);
    } else if (data.satVByteSelected === -1) {
      txMempoolPetitionTo(
        "/miningQueueAPI/block/" + data.blockSelected,
        setData
      );
    } else if (data.txIndexSelected === -1) {
      txMempoolPetitionTo(
        "/miningQueueAPI/histogram/" +
        data.blockSelected +
        "/" +
        data.satVByteSelected,
        setData
      );
    }
  }

  /**********************************************Media Queries ************************************************/
  const isMobile = useMediaQuery({query: '(max-width: 700px)'})
  const graphNotFit = useMediaQuery({query: '(max-width: 600px)'})
  const wSize = useWindowSize();
  /**********************************************Block Functions *********************************************/
  function onBlockSelected(blockSelected) {
    setHelpWanted(false);
    //petition when first or subsequent click on block
    txMempoolPetitionTo("/miningQueueAPI/block/" + blockSelected, (incomingData) => {
      if (incomingData.blockHistogram.length === 1) {
        onAutoSatVByteSelected(blockSelected, incomingData.blockHistogram[0].m);
        return;
      }
      setData(incomingData);
    });
    setTxIdText("");
    setTxIdNotFound(false);
  }

  /**********************************************SatVByte Functions *********************************************/
  function onSatVByteSelected(satVByteSelected) {
    setHelpWanted(false);
    const setElem = data.blockHistogram.find(ele => ele.m === satVByteSelected);
    if (setElem !== undefined) {
      if (setElem.n === 1) {
        onAutoTxIndexSelected(satVByteSelected, 0);
        return;
      }
    }
    txMempoolPetitionTo(
      "/miningQueueAPI/histogram/" +
      data.blockSelected +
      "/" +
      satVByteSelected,
      setData
    );
    setTxIdText("");
    setTxIdNotFound(false);
  }

  /**********************************************TxIndex Functions *********************************************/
  function onTxIndexSelected(txIndexSelected) {
    setHelpWanted(false);
    txMempoolPetitionTo(
      "/miningQueueAPI/txIndex/" +
      data.blockSelected +
      "/" +
      data.satVByteSelected +
      "/" +
      txIndexSelected,
      (incomingData) => {
        extractInvTxAndSetData(incomingData);
        setTxIdText(incomingData.txIdSelected);
      }
    );
  }
  /**************************************************Auto Functions *********************************************/
  function onAutoTxIndexSelected(satVByteSelected, txIndexSelected) {
    setHelpWanted(false);
    txMempoolPetitionTo(
      "/miningQueueAPI/txIndex/" +
      data.blockSelected +
      "/" +
      satVByteSelected +
      "/" +
      txIndexSelected,
      (incomingData) => {
        extractInvTxAndSetData(incomingData);
        setTxIdText(incomingData.txIdSelected);
      }
    );
  }
  function onAutoSatVByteSelected(blockSelected, satVByteSelected) {
    setHelpWanted(false);
    txMempoolPetitionTo(
      "/miningQueueAPI/histogram/" +
      blockSelected +
      "/" +
      satVByteSelected,
      setData
    );
    setTxIdText("");
    setTxIdNotFound(false);
  }
  /*************************************************TxIdText Functions *********************************************/
  function onTxIdTextChanged(event) {
    const txIdText = event.target.value;
    setTxIdText(txIdText);
  }

  function onTxInputKeyPress(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      onTxSearchButton();
    }
  }

  function onTxSearchButton() {
    setHelpWanted(false);
    txMempoolPetitionTo(
      "/miningQueueAPI/tx/" + txIdTextState,
      (incomingData) => {
        if (incomingData.txIdSelected === "") {
          setTxIdNotFound(true);
          extractInvTxAndSetData(incomingData); //It will return basic mempool data if tx not found
        } else {
          setTxIdNotFound(false);
          extractInvTxAndSetData(incomingData);
        }
      }
    );
  }

  /*************************************************TxIdChanged Functions ********************************************/
  function onTxIdSelected(tId) {
    txMempoolPetitionTo("/miningQueueAPI/tx/" + tId, (incomingData) => {
      if (incomingData.txIdSelected === "") {
        setTxIdNotFound(true);
        extractInvTxAndSetData(incomingData); //It will return basic mempool data if tx not found
      } else {
        setTxIdNotFound(false);
        setTxIdText(tId);
        extractInvTxAndSetData(incomingData);
      }
    });
  }

  function onTxFancy() {
    setHelpWanted(false);
    txMempoolPetitionTo("/miningQueueAPI/txFancy", (incomingData) => {
      if (incomingData.txIdSelected === "") {
        setTxIdNotFound(true);
        extractInvTxAndSetData(incomingData); //It will return basic mempool data if tx not found
      } else {
        setTxIdNotFound(false);
        setTxIdText(incomingData.txIdSelected);
        extractInvTxAndSetData(incomingData);
      }
    });
  }

  function onSetLockMempool(lock) {
    setLockMempool(lock);
    if (!lock && data.txIdSelected !== "") {
      onTxIdSelected(data.txIdSelected);
    }
  }
  function isTxIgnored() {
    if (
      data.txIgnoredDataBT.ignoringBlocks.length !== 0 ||
      data.txIgnoredDataOurs.ignoringBlocks.length !== 0
    )
      return true;
    return false;
  }
  /************************************************DRAWING ******************************************************/
  return (
    <Box>

      <TxIdBox txIdTextState={txIdTextState}
        onTxIdTextChanged={onTxIdTextChanged}
        onTxInputKeyPress={onTxInputKeyPress}
        onTxSearchButton={onTxSearchButton}
        onTxFancy={onTxFancy}
        txIdNotFoundState={txIdNotFoundState}
        lockMempool={lockMempool}
        onSetLockMempool={onSetLockMempool}
        data={data}
      />

      <Grid container
        direction="row"
        justifyContent="center">

        {helpWanted && <Explanation
          width={graphNotFit ? wSize.width - 20 : 600} />}

        <MempoolPanel data={data}
          graphNotFit={graphNotFit}
          wSize={wSize}
          mempoolBy={mempoolBy}
          setMempoolBy={setMempoolBy}
          onBlockSelected={onBlockSelected}
        />

        <BlockPanel data={data}
          onSatVByteSelected={onSatVByteSelected}
          blockBy={blockBy}
          setBlockBy={setBlockBy}
        />
        <TxsPanel data={data}
          onTxIndexSelected={onTxIndexSelected}
          txsBy={txsBy}
          setTxsBy={setTxsBy}
        />
      </Grid>

      {data.txIdSelected !== "" && <Position data={data} />}
      {
        data.txIdSelected !== "" &&
        data.txDependenciesInfo.nodes !== null &&
        data.txDependenciesInfo.nodes.length !== 1 && (
          <div>
            <h2 id="txsDependencyGraph">Dependency Graph</h2>
            <ForceGraphHeader
              interactive={interactive}
              setInteractive={setInteractive}
            />
            <ForceGraph
              colorRange={["LightGreen", "red"]}
              interactive={interactive}
              data={dataForForceGraph(data, onTxIdSelected)}
            />
          </div>
        )
      }
      {
        data.txIdSelected !== "" && !isTxIgnored() && (
          <div>
            <h3>
              Transaction has not been ignored by miners compared against our
              mempool.
            </h3>
          </div>
        )
      }
      {
        data.txIdSelected !== "" &&
        isTxIgnored() &&
        data.txDependenciesInfo !== undefined && (
          <div>
            <IgnoringBlocksSection
              igData={data.txIgnoredDataBT}
              nodeData={data.txDependenciesInfo.nodes[0]}
              algo="BITCOIND"
            />
            <IgnoringBlocksSection
              igData={data.txIgnoredDataOurs}
              nodeData={data.txDependenciesInfo.nodes[0]}
              algo="OURS"
            />
          </div>
        )
      }
      {
        data.txIdSelected !== "" &&
        data.tx !== null &&
        data.txDependenciesInfo !== undefined && (
          <div>
            <h2>Transaction Details:</h2>
            <TxDetails
              data={data.tx}
              nodeData={data.txDependenciesInfo.nodes[0]}
              fblTxSatVByte={data.fblTxSatVByte}
            />
          </div>
        )
      }
    </Box >
  );
}

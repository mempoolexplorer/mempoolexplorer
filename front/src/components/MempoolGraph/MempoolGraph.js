import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid";
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {hasGraphInfoFrom,isTxIgnoredFrom, txMempoolPetitionTo} from "../../utils/utils";
import {ForceGraphView} from "./ForceGraphView/ForceGraphView";
import {Heading} from "./Heading/Heading";
import {HierarchicalView} from "./HierarchicalView/HierarchicalView";
import {IgBlocksView} from "./IgBlocksView/IgBlocksView";
import "./MempoolGraph.css";
import {Position} from "./Position/Position";
import {TxDetailsView} from "./TxDetailsView/TxDetailsView";
import {InputsAndOutputsView} from "./TxIOView/InputsAndOutputsView";

export function MempoolGraph(props) {
  const {setTitle} = props;
  const [data, setData] = useState({txIdSelected: ""});
  const [invTx, setInvTx] = useState({});
  const [txIdNotFoundState, setTxIdNotFound] = useState(false);
  const [txIdTextState, setTxIdText] = useState("");
  const [lockMempool, setLockMempool] = useState(false);
  const [helpWanted, setHelpWanted] = useState(true);
  const [mempoolBy, setMempoolBy] = useState("byBoth");
  const [txsBy, setTxsBy] = useState("byBoth");
  const [blockBy, setBlockBy] = useState("byBoth");
  const [fgExpanded, setFgExpanded] = useState(true);
  const [fgMax, setFgMax] = useState(false);
  const [hmvExpanded, setHmvExpanded] = useState(true);
  const [posExpanded, setPosExpanded] = useState(true);
  const [igExpanded, setIgExpanded] = useState(true);
  const [detExpanded, setDetExpanded] = useState(true);
  const [ioExpanded, setIoExpanded] = useState(true);
  const [fgInteractive, setFgInteractive] = useState(false);
  const [fgSnackOpen, setFgSnackOpen] = useState(false);
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("1800"));
  const jumpOnTxRef = useRef();
  const jumpOnBlocRef = useRef();
  const jumpOnSatVByteRef = useRef();

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
    setTitle("Bitcoin Mempool");
    const timerId = setInterval(() => updateDataByTimer(), 5000);
    return function cleanup() {
      clearInterval(timerId);
    };
  });

  //Only executed once at begining.
  useEffect(() => {
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

  async function scrollTo(ref) {
    await new Promise((resolve) => {setTimeout(() => resolve(), 500)})
    if (ref.current === undefined) return;
    const element = ref.current;
    const offset = 55;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

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
    scrollTo(jumpOnBlocRef);
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
    scrollTo(jumpOnSatVByteRef);
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
    scrollTo(jumpOnTxRef);
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
    scrollTo(jumpOnTxRef);
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
    scrollTo(jumpOnTxRef);
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
    scrollTo(jumpOnTxRef);
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
    scrollTo(jumpOnTxRef);
  }

  function onSetLockMempool(lock) {
    setLockMempool(lock);
    if (!lock && data.txIdSelected !== "") {
      onTxIdSelected(data.txIdSelected);
    }
  }

  /************************************************DRAWING ******************************************************/
  function DrawMobile() {
    return (
      <>
        <Position data={data}
          jumpOnTxRef={jumpOnTxRef}
          expanded={posExpanded}
          setExpanded={setPosExpanded}
        />

        <ForceGraphView
          data={data}
          onTxIdSelected={onTxIdSelected}
          lockMempool={lockMempool}
          setLockMempool={setLockMempool}
          expanded={fgExpanded}
          setExpanded={setFgExpanded}
          interactive={fgInteractive}
          setInteractive={setFgInteractive}
          fgMax={fgMax}
          setFgMax={setFgMax}
          open={fgSnackOpen}
          setOpen={setFgSnackOpen}
        />

        <IgBlocksView
          data={data}
          expanded={igExpanded}
          setExpanded={setIgExpanded}
        />

        <TxDetailsView
          data={data}
          expanded={detExpanded}
          setExpanded={setDetExpanded}
        />

      </>
    )
  }

  function DrawDesktop() {
    const hasGraphInfo = hasGraphInfoFrom(data);
    const isTxIgnored = isTxIgnoredFrom(data);
    const full = (isTxIgnored && !hasGraphInfo) || (!isTxIgnored && hasGraphInfo) || fgMax;
    return (
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={6}>
          <Position data={data}
            jumpOnTxRef={jumpOnTxRef}
            expanded={posExpanded}
            setExpanded={setPosExpanded}
          />
        </Grid>
        <Grid item xs={6}>
          <TxDetailsView
            data={data}
            expanded={detExpanded}
            setExpanded={setDetExpanded}
          />
        </Grid>

        <Grid item xs={full ? 12 : 6}>
          <ForceGraphView
            data={data}
            onTxIdSelected={onTxIdSelected}
            lockMempool={lockMempool}
            setLockMempool={setLockMempool}
            expanded={fgExpanded}
            setExpanded={setFgExpanded}
            interactive={fgInteractive}
            setInteractive={setFgInteractive}
            fgMax={fgMax}
            setFgMax={setFgMax}
            open={fgSnackOpen}
            setOpen={setFgSnackOpen}
          />
        </Grid>

        <Grid item xs={full ? 12 : 6}>
          <IgBlocksView
            data={data}
            expanded={igExpanded}
            setExpanded={setIgExpanded}
          />
        </Grid>
      </Grid>
    )
  }
  return (
    <Box>

      <Heading txIdTextState={txIdTextState}
        onTxIdTextChanged={onTxIdTextChanged}
        onTxInputKeyPress={onTxInputKeyPress}
        onTxSearchButton={onTxSearchButton}
        onTxFancy={onTxFancy}
        txIdNotFoundState={txIdNotFoundState}
        lockMempool={lockMempool}
        onSetLockMempool={onSetLockMempool}
        data={data}
      />

      <HierarchicalView
        data={data}
        helpWanted={helpWanted}
        onBlockSelected={onBlockSelected}
        onSatVByteSelected={onSatVByteSelected}
        onTxIndexSelected={onTxIndexSelected}
        jumpOnBlocRef={jumpOnBlocRef}
        jumpOnSatVByteRef={jumpOnSatVByteRef}
        mempoolBy={mempoolBy}
        setMempoolBy={setMempoolBy}
        blockBy={blockBy}
        setBlockBy={setBlockBy}
        txsBy={txsBy}
        setTxsBy={setTxsBy}
        expanded={hmvExpanded}
        setExpanded={setHmvExpanded}
      />
      {!desktop && <DrawMobile />}
      {desktop && <DrawDesktop />}

      <InputsAndOutputsView
        data={data}
        expanded={ioExpanded}
        setExpanded={setIoExpanded}
      />
    </Box>
  );
}

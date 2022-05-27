import Box from '@mui/material/Box';
import React, {useEffect, useState, useRef} from "react";
import {useParams} from "react-router-dom";
import {txMempoolPetitionTo} from "../../utils/utils";
import {ForceGraphView} from "./ForceGraphView/ForceGraphView";
import {Heading} from "./Heading/Heading";
import {HierarchicalView} from "./HierarchicalView/HierarchicalView";
import {IgBlocksView} from "./IgBlocksView/IgBlocksView";
import "./MempoolGraph.css";
import {Position} from "./Position/Position";
import {InputsAndOutputsView} from "./TxIOView/InputsAndOutputsView";
import {TxDetailsView} from "./TxDetailsView/TxDetailsView";

export function MempoolGraph(props) {
  const {setTitle} = props;
  //TODO: Refactorizar

  const [data, setData] = useState({txIdSelected: ""});
  const [invTx, setInvTx] = useState({});
  const [txIdNotFoundState, setTxIdNotFound] = useState(false);
  const [txIdTextState, setTxIdText] = useState("");
  const [lockMempool, setLockMempool] = useState(false);
  const [helpWanted, setHelpWanted] = useState(true);
  const jumpOnTxRef = useRef();

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

  async function scroll() {
    await new Promise((resolve) => {setTimeout(() => resolve(), 500)})
    if (jumpOnTxRef.current === undefined) return;
    const element = jumpOnTxRef.current;
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
  useEffect(() => {
    scroll();
  }, [invTx]);

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
    // jumpOnTxRef.current.scrollIntoView({behavior: 'smooth'});
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
    // jumpOnTxRef.current.scrollIntoView({behavior: 'smooth'});
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
    // jumpOnTxRef.current.scrollIntoView({behavior: 'smooth'});
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
    // jumpOnTxRef.current.scrollIntoView({behavior: 'smooth'});
  }

  function onSetLockMempool(lock) {
    setLockMempool(lock);
    if (!lock && data.txIdSelected !== "") {
      onTxIdSelected(data.txIdSelected);
    }
  }

  /************************************************DRAWING ******************************************************/
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
      />

      <Position data={data}
        jumpOnTxRef={jumpOnTxRef}
      />

      <ForceGraphView
        data={data}
        onTxIdSelected={onTxIdSelected}
        lockMempool={lockMempool}
        setLockMempool={setLockMempool}
      />

      <IgBlocksView data={data} />

      <TxDetailsView
        data={data}
      />

      <InputsAndOutputsView data={data} />

    </Box >
  );
}

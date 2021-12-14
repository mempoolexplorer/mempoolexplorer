import React, { useEffect, useState } from "react";
import "./MempoolGraph.css";
import { Link } from "react-router-dom";
import { ScaleCheckers } from "./ScaleCheckers/ScaleCheckers";
import { TDStackBarGraph } from "./TDStackBarGraph/TDStackBarGraph";
import { TxSpeedGraph } from "./TxSpeedGraph/TxSpeedGraph";
import { ForceGraph } from "./ForceGraph/ForceGraph";
import { ForceGraphHeader } from "./ForceGraph/ForceGraphHeader";
import { getNumberWithOrdinal, petitionTo } from "../../utils/utils";
import { UpdateBox } from "./UpdateBox/UpdateBox";
import { IgnoringBlocksSection } from "./IgnoringBlocksSection/IgnoringBlocksSection";
import {
  dataForMiningQueueGraph,
  dataForBlockGraph,
  dataForTxsGraph,
  dataForForceGraph,
} from "./dataCreation";
import { useParams } from "react-router-dom";
import { TxDetails } from "./TxDetails/TxDetails";

export function MempoolGraph() {
  const [mempoolBy, setMempoolBy] = useState("byBoth");
  const [blockBy, setBlockBy] = useState("byBoth");
  const [txsBy, setTxsBy] = useState("byBoth");

  const [data, setData] = useState({ txIdSelected: "" });
  const [invTx, setInvTx] = useState({});
  const [txIdNotFoundState, setTxIdNotFound] = useState(false);
  const [txIdTextState, setTxIdText] = useState("");
  const [lockMempool, setLockMempool] = useState(false);
  const [interactive, setInteractive] = useState(true);

  let { txId } = useParams();

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
    const timerId = setInterval(() => updateDataByTimer(), 5000);
    return function cleanup() {
      clearInterval(timerId);
    };
  });

  //Only executed once at begining.
  useEffect(() => {
    console.log(txId);
    if (txId !== undefined) {
      setTxIdText(txId);
      petitionTo("/miningQueueAPI/tx/" + txId, (incomingData) => {
        if (incomingData.txIdSelected === "") {
          setTxIdNotFound(true);
        }
        extractInvTxAndSetData(incomingData);
      });
    } else {
      petitionTo("/miningQueueAPI/miningQueue", setData);
    }
  }, [txId]);

  function updateDataByTimer() {
    if (lockMempool === true) return;
    if (data.txIdSelected !== "") {
      petitionTo("/miningQueueAPI/txCached/" + data.txIdSelected, mergeData);
    } else if (data.blockSelected === -1) {
      petitionTo("/miningQueueAPI/miningQueue", setData);
    } else if (data.satVByteSelected === -1) {
      petitionTo("/miningQueueAPI/block/" + data.blockSelected, setData);
    } else if (data.txIndexSelected === -1) {
      petitionTo(
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
    //petition when first or subsequent click on block
    petitionTo("/miningQueueAPI/block/" + blockSelected, setData);
    setTxIdText("");
    setTxIdNotFound(false);
  }

  /**********************************************SatVByte Functions *********************************************/
  function onSatVByteSelected(satVByteSelected) {
    petitionTo(
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
    petitionTo(
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
    petitionTo("/miningQueueAPI/tx/" + txIdTextState, (incomingData) => {
      if (incomingData.txIdSelected === "") {
        setTxIdNotFound(true);
        extractInvTxAndSetData(incomingData); //It will return basic mempool data if tx not found
      } else {
        setTxIdNotFound(false);
        extractInvTxAndSetData(incomingData);
      }
    });
  }

  /*************************************************TxIdChanged Functions ********************************************/
  function onTxIdSelected(tId) {
    petitionTo("/miningQueueAPI/tx/" + tId, (incomingData) => {
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
    petitionTo("/miningQueueAPI/txFancy", (incomingData) => {
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
    <div>
      <div className="txIdSelector">
        <label>
          TxId:
          <input
            className="txIdInput"
            type="text"
            placeholder="Insert a TxId or choose one by CLICKING the mempool..."
            size="70"
            value={txIdTextState}
            onChange={onTxIdTextChanged}
            onKeyPress={onTxInputKeyPress}
          ></input>
        </label>
        <button onClick={onTxSearchButton}>Go!</button>
        {txIdNotFoundState && (
          <h2 className="txIdNotFound">TxId not Found in mempool</h2>
        )}
      </div>
      <div className="softLabel">
        <label>...or try a fancy transaction:</label>
        <button onClick={onTxFancy}>Go!</button>
      </div>
      <div className="softLabel">
        <label>
          ...or click <Link to="/faq#mempoolRepresentation">here</Link> for help
        </label>
      </div>
      <UpdateBox
        lockMempool={lockMempool}
        setLockMempool={onSetLockMempool}
        lastUpdate={data.lastModTime}
      />
      <div className="Mempool">
        <div className="MiningQueueSection">
          <div className="miningQueueScaleCheckersDiv">
            <ScaleCheckers
              by={mempoolBy}
              leftText="Weight"
              rightText="Num Txs"
              onChange={setMempoolBy}
              label="Scale by:"
            />
          </div>
          <div className="txSpeedGraph">
            <div className="pad"></div>
            <TxSpeedGraph
              height="150"
              width="50"
              barWidth="30"
              speed={data.weightInLast10minutes}
            />
          </div>
          <div className="miningQueueGraphDiv">
            <TDStackBarGraph
              data={dataForMiningQueueGraph(
                data,
                onBlockSelected,
                data.blockSelected
              )}
              verticalSize={600}
              barWidth={300}
              by={mempoolBy}
            />
          </div>
          <div className="miningQueueLabel">
            <span>Current Bitcoin Mempool</span>
          </div>
        </div>
        {data.blockSelected !== -1 && (
          <div className="CandidateBlockSection">
            <ScaleCheckers
              by={blockBy}
              leftText="Weight"
              rightText="Num Txs"
              onChange={setBlockBy}
              label="Scale by:"
            />
            <TDStackBarGraph
              data={dataForBlockGraph(
                data,
                onSatVByteSelected,
                data.satVByteSelected
              )}
              verticalSize={600}
              barWidth={300}
              by={blockBy}
            />

            {data.blockSelected !== -1 && (
              <span>{getNumberWithOrdinal(data.blockSelected + 1)} block</span>
            )}
          </div>
        )}
        {data.satVByteSelected !== -1 && (
          <div className="TxsSection">
            <ScaleCheckers
              by={txsBy}
              leftText="Weight"
              rightText="Num Txs"
              onChange={setTxsBy}
              label="Scale by:"
            />
            <TDStackBarGraph
              data={dataForTxsGraph(
                data,
                onTxIndexSelected,
                data.txIndexSelected
              )}
              verticalSize={600}
              barWidth={300}
              by={txsBy}
            />
            {data.satVByteSelected !== -1 && (
              <span>
                SatVByte: {data.satVByteSelected}
                {data.txIndexSelected !== -1 && (
                  <span>
                    / Position: {getNumberWithOrdinal(data.txIndexSelected + 1)}
                  </span>
                )}
              </span>
            )}
          </div>
        )}
      </div>
      {data.txIdSelected !== "" &&
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
        )}
      {data.txIdSelected !== "" && !isTxIgnored() && (
        <div>
          <h3>Transaction has not been ignored by miners.</h3>
        </div>
      )}
      {data.txIdSelected !== "" &&
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
        )}
      {data.txIdSelected !== "" &&
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
        )}
    </div>
  );
}

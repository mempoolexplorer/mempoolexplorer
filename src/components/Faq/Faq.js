import React from "react";
import { Link } from "react-router-dom";
import "./Faq.css";

export function Faq(props) {
  var hostFaq = window.location.host + "/faq#";
  return (
    <div className="mainDivFaq">
      <h1>Frequently Asked Questions</h1>
      <h2>The project</h2>
      <h3>
        <a id="aims" href={hostFaq + "aims"} className="dullAnchor">
          <span className="mutedText">#</span>{" "}
          <span className="borderBottom"> Aims</span>
        </a>
      </h3>
      <p>
        This project has been developed to track where unconfirmed Bitcoin
        transactions are in the <Link to="/mempool">mining queue</Link>.
      </p>
      <p>
        It began as a toy project to learn microservices architecture in java
        using the <a href="https://spring.io/">Spring Framework</a>, but I think
        now it's good enough to show it to the public. Also, another use cases
        has been added as:
        <Link to="/txsGraphs">transactions dependency graphs</Link>,{" "}
        <Link to="/igTx">ignored transactions monitoring </Link>and{" "}
        <Link to="/miner">miners profit looses </Link>against an{" "}
        <a href={hostFaq + "idealAlgorithm"}> "ideal"</a> transaction selection
        algorithm.
      </p>
      <p>
        This is a work in progress:{" "}
        <b>
          stored block data can be reseted without notice, and miner profit
          looses needs revision
        </b>
        , but mempool view is fully functional. <br></br>
        Ignored transactions sections use the{" "}
        <a href={hostFaq + "idealAlgorithm"}>"ideal"</a> transaction selection
        algorithm, not getBlockTemplate pooling.
      </p>
      <h2>Terminology</h2>
      <h3>
        <a
          id="idealAlgorithm"
          href={hostFaq + "idealAlgorithm"}
          className="dullAnchor"
        >
          <span className="mutedText">#</span>{" "}
          <span className="borderBottom">
            {" "}
            Ideal transaction selection algorithm
          </span>
        </a>
      </h3>
      <p>
        In short, the "ideal" algorithm is an algorithm that sorts transactions
        in the usual greedy way: using the regular Ancestor Set Based (ASB)
        algorithm defined{" "}
        <a href="https://gist.github.com/Xekyo/5cb413fe9f26dbce57abfd344ebbfaf2#file-candidate-set-based-block-building-md">
          here
        </a>
        . But this algorithm is executed when a block arrives, and against the
        mempool before mined transactions are removed. Thus, it ignores
        getBlockTemplate pooling time and block template propagation time
        through mining infrastructure.
      </p>
      <p>This FAQ will be updated ASAP</p>
    </div>
  );
}

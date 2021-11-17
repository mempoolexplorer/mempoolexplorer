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
        This project has been developed to track where Bitcoin
        transactions are in the mining queue.
      </p>
      <p>
        It began as a toy project to learn microservices architecture in java,
        using the <a href="https://spring.io/">Spring Framework</a> but I think
        now it's good enough to show it to the public. Also, another use cases
        has been added as:{" "}
        <Link to="/txsGraphs">transactions dependency graphs</Link>,{" "}
        <Link to="/igTx">ignored transactions monitoring </Link>and{" "}
        <Link to="/miner">miners profit looses </Link>against an "ideal"
        transaction selection algorithm.
      </p>
      <p>
        This is a work in progress: stored block data can be reseted without
        notice, but mempool view is fully functional.
      </p>
      <p>This FAQ will be updated ASAP</p>
    </div>
  );
}

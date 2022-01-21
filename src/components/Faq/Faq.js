import React from "react";
import { HashLink } from "react-router-hash-link";
import "./Faq.css";

export function Faq() {
  return (
    <div className="mainDivFaq">
      <h1>Frequently Asked Questions</h1>
      <h2>The project</h2>
      <h3>
        <a id="aims" href="#aims" className="dullAnchor">
          <span className="mutedText">#</span>{" "}
          <span className="borderBottom"> Aims</span>
        </a>
      </h3>
      <p>
        This project has been developed to track where unconfirmed Bitcoin
        transactions are in the (our){" "}
        <HashLink to="/mempool">mining queue</HashLink>.
      </p>
      <p>
        It began as a toy project to learn microservices architecture in java
        using the <a href="https://spring.io/">Spring Framework</a>, but I think
        now it's good enough to show it to the public. Also, another use cases
        has been added as:{" "}
        <HashLink to="/txsGraphs">transactions dependency graphs</HashLink>,{" "}
        <HashLink to="/igTx">ignored transactions monitoring </HashLink>and{" "}
        <HashLink to="/miner">miners profit looses </HashLink>against an "
        <HashLink smooth to="#onBlockArrivalAlgorithm">
          on block arrival
        </HashLink>
        " transaction selection algorithm which, sadly, have some{" "}
        <HashLink smooth to="#methodology">
          unsolvable
        </HashLink>{" "}
        problems of accuracy.
      </p>
      <p>
        Some of the features of this pages overlaps with others like:
        <ul>
          <li>
            <a href="https://mempool.observer">mempool.observer</a>
          </li>
          <li>
            <a href="https://miningpool.observer/">miningpool.observer</a>
          </li>
          <li>
            <a href="https://mempool.space/">mempool.space</a>
          </li>
        </ul>
        Visit them to compare and gather more data about the mempool ;-)
      </p>
      <p>
        This is a work in progress:{" "}
        <b>stored block data can be reseted without notice</b>, but mempool
        view, ignored and missing transactions and transactions graphs are fully
        functional. <br></br>
      </p>
      <h2>Mempool</h2>
      <h3>
        <a id="mempool" href="#mempool" className="dullAnchor">
          <span className="mutedText">#</span>{" "}
          <span className="borderBottom"> What is the bitcoin mempool?</span>
        </a>
      </h3>
      <p>
        When you send a bitcoin transaction to the network, if valid, it is
        queued in the bitcoin mempool waiting to be mined. There Ain't No Such
        Thing As A Global Mempool (
        <a
          href="https://lists.linuxfoundation.org/pipermail/bitcoin-dev/2020-July/018017.html"
          target="_blank"
          rel="noreferrer"
        >
          TANSTAAGM
        </a>
        ). Each bicoin node in the network may have differences because of data
        propagation timing y/o errors, and conficting transactions or blocks.
        Consensus is only achived by the proof of work made by miners throughout
        time. Results shown in this page may vary with other mempool browsers
        because each one uses different bitcoin nodes.
      </p>
      <p>
        Transactions have a size in vBytes called weight and pays a fee in
        satoshis in order to be mined. Miners order transactions to obtain the
        best profit, which normaly is by using the value fee/vBytes. That is,
        the smaller and more generous the transaction is, the faster is mined.
      </p>
      <p>
        Each bitcoin block has a maximum weight of 4M for decentralization
        reasons, although the number of transactions within a block may vary. A
        bitcoin block is mined each 10 minutes in average since is a random
        process similar to a lottery.
      </p>
      <h3>
        <a
          id="mempoolRepresentation"
          href="#mempoolRepresentation"
          className="dullAnchor"
        >
          <span className="mutedText">#</span>{" "}
          <span className="borderBottom">Mempool representation</span>
        </a>
      </h3>
      <p>
        Blocks waiting to be mined are represented in the{" "}
        <HashLink to="/mempool">graph</HashLink> scaled by weight, number of
        transactions or both. By clicking in one of these blocks, another graph
        is shown with the contents of that block ordered by sub-blocks
        containing the transactions with the same satoshis/VByte integer value.
        Again, by clicking in one of these sub-blocks, another graph is shown
        with all the transactions in that sub-block. Finally, if a transaction
        is clicked in the third graph, information about dependencies, whether
        has been ignored by miners, input & outputs and other details are shown.
      </p>
      <p>
        Blocks, sub-blocks, and transactions are all scaled by weight, number of
        transactions or both in all graphs. Also, they are colored from red to
        green depending on the satoshis/vByte ratio. In some cases, a scroll bar
        is needed to show the content guaranteeing all elements are clickable
        (at least 1px height).
      </p>
      <p>
        The small graph at the bottom left shows how much transaction weight has
        arrived in the last 10 minutes (average block time). This is a good
        indicator for the speed at which the mempool is filling: above 4M/10
        minutes the mempool is, in average, filling, and below that value, is
        emptying.
      </p>
      <p>
        The algorithm for transaction selection in the{" "}
        <HashLink to="/mempool">graph</HashLink> takes into account transaction
        dependencies and{" "}
        <HashLink smooth to="#cpfp">
          CPFP
        </HashLink>
        .
      </p>
      <h2>Terminology</h2>
      <h4>
        <a id="blockTemplate" href="#blockTemplate" className="dullAnchor">
          <span className="mutedText">#</span>{" "}
          <span className="borderBottom"> Block template</span>
        </a>
      </h4>
      <p>
        A block template is the list of transactions chosen by a miner from its
        mempool to be included into its next mined block. Normaly miners select
        the block template to maximize profits, but they can include its own
        transactions apart from coinbase, or follow state jurisdiction
        regulations.
      </p>
      <h4>
        <a id="conflictingTxs" href="#conflictingTxs" className="dullAnchor">
          <span className="mutedText">#</span>{" "}
          <span className="borderBottom">Conflicting Transactions</span>
        </a>
      </h4>
      <p>
        Two or more transactions are conflicting if they spend the same UTXO
        (Unspent Transaction Output).
      </p>
      <h4>
        <a id="minerName" href="#minerName" className="dullAnchor">
          <span className="mutedText">#</span>{" "}
          <span className="borderBottom">Miner name</span>
        </a>
      </h4>
      <p>
        Although mining is an anonymous process, mining pools often can be
        identified by a small text or character secuence left in the coinbase
        transaction, or by its output address.
      </p>
      <p>
        When a miner name cannot be identified, we treat it as{" "}
        <HashLink smooth to="/miner/unknown">
          unknown
        </HashLink>
        . By hovering the mouse over a miner name, the coinbase transaction in
        hexadecimal is shown
      </p>
      <h3 id="txSelAlgo">Transaction selection algorithms:</h3>
      <h4>
        <a
          id="getBlockTemplateAlgorithm"
          href="#getBlockTemplateAlgorithm"
          className="dullAnchor"
        >
          <span className="mutedText">#</span>{" "}
          <span className="borderBottom"> GetBlockTemplate algorithm</span>
        </a>
      </h4>
      <p>
        GetBlockTemplate is the name of the RPC exposed by a bitcoin node to
        miners to obtain a block template to be mined. The content returned
        changes each 30 seconds, and contains the list of transactions which
        maximizes profits, but limited by block size. Miners can use other
        methods to obtain a block template and its profit losses or gains are
        measured against our bitcoin node and algorithms{" "}
        <HashLink to="/miner">here</HashLink>.
      </p>
      <h4>
        <a
          id="onBlockArrivalAlgorithm"
          href="#onBlockArrivalAlgorithm"
          className="dullAnchor"
        >
          <span className="mutedText">#</span>{" "}
          <span className="borderBottom">
            {" "}
            On block arrival transaction selection algorithm
          </span>
        </a>
      </h4>
      <p>
        In short, the "onBlockArrival" is an algorithm that sorts transactions
        in the usual greedy way: using the regular Ancestor Set Based (ASB)
        algorithm defined{" "}
        <a href="https://gist.github.com/Xekyo/5cb413fe9f26dbce57abfd344ebbfaf2#file-candidate-set-based-block-building-md">
          here
        </a>
        , and considering transaction dependencies and{" "}
        <HashLink smooth to="#cpfp">
          CPFP
        </HashLink>
        . But this algorithm is executed by us when a block arrives to our node,
        and against the mempool before mined transactions are removed. Thus, it
        ignores getBlockTemplate pooling time and block template propagation
        time through mining infrastructure. But it does not ignore the
        propagation time of the mined block to us. Nevertheless, as we have the
        size of the mined block coinbase transaction, we can calculate with more
        accuracy the candidate block free space than with getBlockTemplate,
        resulting in a better comparison between candidate block and real mined
        block.
      </p>
      <h3>Transaction promotion in the mining queue</h3>
      <p>
        Nodes as Bitcoin Core allow transactions in mempool to be promoted in
        the mining queue by{" "}
        <a href="https://github.com/bitcoin/bips/blob/master/bip-0125.mediawiki">
          Bip-125 RBF
        </a>{" "}
        or by <a href="https://bitcoinops.org/en/topics/cpfp/">CPFP</a>
      </p>
      <h4>
        <a id="bip125" href="#bip125" className="dullAnchor">
          <span className="mutedText">#</span>{" "}
          <span className="borderBottom"> Bip125 Replace By Fee</span>
        </a>
      </h4>
      <p>
        Some wallets allows the creation of transactions that can be replaced in
        mempool by others with higher fees. See{" "}
        <a href="https://github.com/bitcoin/bips/blob/master/bip-0125.mediawiki">
          Bip-125 RBF
        </a>{" "}
        for details.
      </p>
      <p>
        Whether a transaction is replaceable or not is shown in the transaction
        details section, at the <HashLink to="/mempool">mempool</HashLink>.
        Also, a Bip-125 replaceable transaction is shown in the dependencies
        graph as a circle with dashed perimeter.
      </p>

      <h4>
        <a id="cpfp" href="#cpfp" className="dullAnchor">
          <span className="mutedText">#</span>{" "}
          <span className="borderBottom">CPFP (Child Pays For Parent)</span>
        </a>
      </h4>
      <p>
        A transaction in the mempool is dependant of other transaction also in
        the mempool if it spends an output of that other transaction. A
        dependant transaction is called a child, and it's dependency it's the
        parent. If a parent transaction has a low fee, and therefore is far
        behind in the mining queue, a depending transaction child can be created
        with higher fees so that the average result of adding weights and fees
        promotes both transactions within the mining queue. Details can be seen{" "}
        <a href="https://bitcoinops.org/en/topics/cpfp/">here</a>.
      </p>
      <p>
        A Bitcoin Core node allows by default the creation of Direct Acyclic
        Graphs (DAG) of depending transactions with a maximum deep of 25. Graphs
        with 2 or more transactions currently in the mempool are listed{" "}
        <HashLink to="/txsGraphs">here</HashLink>.
      </p>
      <p>
        Transactions with dependencies or dependant of others are shown at the{" "}
        <HashLink to="/mempool">mempool</HashLink> within a special section
        called dependencies graph, which draws the full graph on which the
        transaction is contained.
      </p>
      <h2>Txs Graphs</h2>
      <p>
        This <HashLink to="/txsGraphs">section</HashLink> shows the list of
        transactions graphs currently in the mempool. Those graphs can be
        linear: forming a long chain of dependencies, or non linear: forming a
        Direct Acyclic Graph.
      </p>
      <p>
        When clicked on transaction number on a graph, a list of the
        transactions contained in the graph is shown. You can navigate to the
        graph by clicking any of this transactions.
      </p>
      <h2 id="ignoredTransactions">Ignored transactions</h2>
      <p>
        As each miner has its own bitcoin node and infrastructure, there are
        different results for a{" "}
        <HashLink smooth to="#blockTemplate">
          block template
        </HashLink>
        . In this <HashLink to="igTx">section</HashLink> are listed the
        transactions that has been included by us using a{" "}
        <HashLink smooth to="#txSelAlgo">
          transaction selection algorithm
        </HashLink>{" "}
        but not has been included in a mined block.
      </p>
      <p>
        Biggest Delta column refers to the biggest difference in time between
        block arrival and transaction arrival to our node. Normally, a
        transaction is included in our block but not in mined one due to
        transaction propagation time.
      </p>
      <h2 id="missingTxs">Missing transactions</h2>
      <p>
        We call missing to a transaction that has been ignored more than three
        times. This can happen for multiple reasons:
      </p>
      <ul>
        <li>
          The transaction has not been propagated to the pool yet and three
          blocks has been mined in little time.
        </li>
        <li>
          There can be multiple multiple{" "}
          <HashLink smooth to="#conflictingTxs">
            {" "}
            conflicting transactions
          </HashLink>{" "}
          in different mempools, due to bitcoin nodes restart (see{" "}
          <a href="https://bitcoin.stackexchange.com/questions/99717/transaction-being-ignored-by-miners-i-mean-ignored-not-not-mined-because-low">
            {" "}
            this thread
          </a>{" "}
          for example), double spend attempts, or replacement transactions
          created via{" "}
          <HashLink smooth to="#bip125">
            Replace By Fee
          </HashLink>
          .
        </li>
        <li>
          The miners are adding its own transactions without broadcasting them
          to the network (see{" "}
          <a href="https://bitcoin.stackexchange.com/questions/93471/ive-found-two-mined-txs-with-no-fee">
            this thread
          </a>
          ), thus, occuping the block space of other transactions.
        </li>
        <li>
          Miners are filtering sanctioned transactions as explained{" "}
          <a href="https://miningpool.observer/faq#sanctioned">here</a>
        </li>
      </ul>
      <p>
        In the <HashLink to="misTx">Missing Txs</HashLink> section, the possible
        states for a missing transaction can be:
      </p>
      <table className="indentedTable ">
        <tbody>
          <tr>
            <td>In Mempool</td>
            <td>Tx is currently in the mempool waiting to be mined</td>
          </tr>
          <tr>
            <td>Mined in block X</td>
            <td>Tx has been mined in block X</td>
          </tr>
          <tr>
            <td>Deleted</td>
            <td>
              Tx has been{" "}
              <a href="https://bitcoin.stackexchange.com/questions/46152/how-do-transactions-leave-the-memory-pool">
                deleted
              </a>{" "}
              from mempool
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        You can click the + symbol at the right of txId to see the list of
        blocks ignoring this transaction, along with other data regarding the
        position of this transaction in our candidate block, miner name, fees
        lost by the miners, time when should have been mined, etc.
      </p>
      <p>
        Transactions can be missing or not by comparing against different{" "}
        <HashLink smooth to="#txSelAlgo">
          selection algorithms
        </HashLink>
        , you can change the algorithm in the combo box.
      </p>
      <h2 id="ignoringBlocksSection">Ignoring Blocks</h2>
      <p>
        <b>Note:</b> You cannot interpret these results to compare how good a
        mining pool is selecting its transactions against us because of the{" "}
        <HashLink smooth to="#methodology">
          methodology used
        </HashLink>{" "}
        and some insolvable problems. We use the term{" "}
        <span className="cursive">virtual</span> for "reward" or "lost reward"
        to point out that problems.
      </p>
      <p>
        Ignoring Blocks <a href="/block/BITCOIND">section</a> lists mined block
        data along with <span className="cursive">virtual lost reward</span> due
        to{" "}
        <HashLink smooth to="#ignoredTransactions">
          ignored transactions
        </HashLink>
        . By clicking on the block height, or{" "}
        <HashLink smooth to="#minerName">
          miner name
        </HashLink>
        , additional details are shown. Negative{" "}
        <span className="cursive">virtual lost reward</span> means better reward
        than us using the selected{" "}
        <HashLink smooth to="#txSelAlgo">
          algorithm
        </HashLink>{" "}
        and our mempool. Reward units are satoshis.
      </p>
      <p>
        Additional details{" "}
        <HashLink to="/block/last/BITCOIND">section</HashLink> for a ignoring
        block shows a table with statistics about transactions when a mined
        block arrived:
      </p>
      <ul>
        <li>
          Whether the transaction was in our mempool, in mined block or in our
          candidate block in different combinations with different meanings.
        </li>
        <li>
          Number of transactions, summation of weight and fees, and average
          sat/vByte for the transactions in that set.
        </li>
      </ul>
      <p>
        Additional details <HashLink to="/miner/unknown">section</HashLink> for
        a miner name shows the table with all bocks mined by that miner,
        including unknown miner names.
      </p>
      <h2 id="miners">Miners</h2>
      <p>
        <b>Note:</b> You cannot interpret these results to compare how good a
        mining pool is selecting its transactions against us because of the{" "}
        <HashLink smooth to="#methodology">
          methodology used
        </HashLink>{" "}
        and some insolvable problems. We use the term{" "}
        <span className="cursive">virtual</span> for "reward" or "lost reward"
        to point out that problems.
      </p>
      <p>
        Miners <HashLink to="/miner">section</HashLink> lists the accumulated
        block <span className="cursive">reward lost</span> because of ignored
        transactions per miner name. Both{" "}
        <HashLink smooth to="#txSelAlgo">
          algorithms
        </HashLink>{" "}
        are compared using the total and average{" "}
        <span className="cursive">lost reward</span> per block.
      </p>
      <p>
        Only block data since bootstrap is shown. Reward units are satoshis.
      </p>
      <h2 id="methodology">Methodology</h2>
      <p>
        <b>Note:</b> There is currently a open question in stackexchange about
        the methodology that is used to measure miners lost revenue
        <a href="https://bitcoin.stackexchange.com/questions/111940/is-there-a-way-to-know-how-good-a-miner-is-choosing-its-transanctions-to-be-mine">
          {" "}
          here
        </a>
      </p>
      <p>
        For the <a href="/block/BITCOIND">ignoring blocks</a> and{" "}
        <HashLink to="/miner">miners</HashLink> section the methodology is as
        follows: when a mined block arrives to our node, we compare it against
        the last result of calling{" "}
        <HashLink smooth to="#getBlockTemplateAlgorithm">
          getBlockTemplate
        </HashLink>{" "}
        and against an execution of{" "}
        <HashLink smooth to="#onBlockArrivalAlgorithm">
          onBlockArrival
        </HashLink>{" "}
        algorithm. This could give us an idea about how good a miner is
        selecting its transactions, but as we have no way of knowing the state
        of the miner mempool before it mines a block, those sections are{" "}
        <b>inaccurate</b>.
      </p>
      <p>
        One can (and I did) make the assumption that received block and your
        block
        <HashLink smooth to="#blockTemplate">
          {" "}
          template
        </HashLink>{" "}
        can be compared. But as the block propagation time is not, by any means,
        neglegible, the comparation is skewed giving the idea that our
        algorithms are better. The reality is that we are receiving transactions
        while the block is beeing propagated to us, and thus, we have normaly a
        bigger mempool than the miner when the block was mined. A bigger mempool
        gives our algoritms the oportunity to search for better transactions
        which had no opportunity to be mined in the former block.
      </p>
      <p>
        I keep those sections in the web page only in case somebody find them
        useful somehow.
      </p>
    </div>
  );
}

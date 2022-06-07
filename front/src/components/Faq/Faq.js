import React, {useEffect} from "react";
import Container from '@mui/material/Container';
import Typography from "@mui/material/Typography";
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useTheme} from "@mui/material";
import {CHashLink} from "../../utils/CommonComponents";


function Paragraph(props) {
  return (
    <Typography variant="body1" paragraph sx={{ml: 4}}>{props.children}</Typography>
  );
}

function H3(props) {
  const theme = useTheme();
  return (
    <Typography id={props.id} color={theme.palette.grey[600]} variant="h3" sx={{my: 2}}>{props.children}</Typography>
  );
}

function H4(props) {
  const theme = useTheme();
  return (
    <Typography id={props.id} color={theme.palette.grey[500]} variant="h4" sx={{ml: 2, my: 2}}>{props.children}</Typography>
  );
}

function Hook(props) {
  return (
    <Paragraph>
      <Link id={props.id} variant="h5" >{props.children}</Link>
    </Paragraph>
  );
}


export function Faq(props) {
  const {setTitle} = props;
  useEffect(() => {
    setTitle("FAQ");
  }, []);
  return (
    <Container>
      <Typography variant="h2">Frequently Asked Questions</Typography>
      <Divider sx={{my: 3}} />
      <H3>The project</H3>
      <Hook id="aims"># Aims</Hook>
      <Paragraph>
        This open source project has been developed to track where unconfirmed Bitcoin
        transactions are in a bitcoin node{" "}
        <CHashLink to="/mempool">mining queue</CHashLink >.
      </Paragraph>
      <Paragraph>
        It began as a toy project to learn microservices architecture in java
        using the <Link href="https://spring.io/">Spring Framework</Link>, but has been refactored many times, and another use cases
        has been added as:{" "}
        <CHashLink to="/txsGraphs">transactions dependency graphs</CHashLink >,{" "}
        <CHashLink to="/igTx">ignored transactions monitoring </CHashLink >and{" "}
        <CHashLink to="/miner">miners profit looses </CHashLink >against an "
        <CHashLink to="#onBlockArrivalAlgorithm">
          on block arrival
        </CHashLink>
        " transaction selection algorithm. Be aware that{" "}
        <CHashLink to="/miner">miners profit looses </CHashLink > have some{" "}
        <CHashLink to="#methodology">
          unsolvable
        </CHashLink >{" "}
        problems of accuracy.
      </Paragraph>
      <Paragraph>
        Some of the features of this pages overlaps with others like:
      </Paragraph>
      <List sx={{ml: 5}}>
        <ListItem>
          <Link href="https://mempool.observer">mempool.observer</Link>
        </ListItem>
        <ListItem>
          <Link href="https://miningpool.observer/">miningpool.observer</Link>
        </ListItem>
        <ListItem>
          <Link href="https://mempool.space/">mempool.space</Link>
        </ListItem>
      </List>
      <Paragraph>
        Visit them to compare and gather more data about the mempool ;-)
      </Paragraph>
      <Paragraph>
        This is a work in progress:{" "}
        <Typography component="span" sx={{fontWeight: "bold"}}>stored block data can be reseted without notice</Typography>, but mempool
        view, ignored and missing transactions and transactions graphs are fully
        functional.
      </Paragraph>
      <H3>Mempool</H3>
      <Hook id="mempool"># What is the bitcoin mempool?</Hook>
      <Paragraph>
        When you send a bitcoin transaction to the network, if valid, it is
        queued in the bitcoin mempool waiting to be mined. There Ain't No Such
        Thing As A Global Mempool (
        <Link
          href="https://lists.linuxfoundation.org/pipermail/bitcoin-dev/2020-July/018017.html"
          target="_blank"
          rel="noreferrer"
        >
          TANSTAAGM
        </Link>
        ). Each bicoin node in the network may have differences because of data
        propagation timing y/o errors, and conficting transactions or blocks.
        Consensus is only achived by the proof of work made by miners throughout
        time. Results shown in this page may vary with other mempool browsers
        because each one uses different bitcoin nodes.
      </Paragraph>
      <Paragraph>
        Transactions have a size in vBytes called weight and pays a fee in
        satoshis in order to be mined. Miners order transactions to obtain the
        best profit, which normaly is by using the value fee/vBytes. That is,
        the smaller and more generous the transaction is, the faster is mined.
      </Paragraph>
      <Paragraph>
        Each bitcoin block has a maximum weight of 4M for decentralization
        reasons, although the number of transactions within a block may vary. A
        bitcoin block is mined each 10 minutes in average since is a random
        process similar to a lottery.
      </Paragraph>
      <Hook id="mempoolRepresentation" ># Mempool representation</Hook>
      <Paragraph>
        Blocks waiting to be mined are represented in the{" "}
        <CHashLink to="/mempool">graph</CHashLink > scaled by weight, number of
        transactions or both. By clicking in one of these blocks, another graph
        is shown with the contents of that block ordered by sub-blocks
        containing the transactions with the same satoshis/VByte integer value.
        Again, by clicking in one of these sub-blocks, another graph is shown
        with all the transactions in that sub-block. Finally, if a transaction
        is clicked in the third graph, information about dependencies, whether
        has been ignored by miners, input & outputs and other details are shown.
      </Paragraph>
      <Paragraph>
        Blocks, sub-blocks, and transactions are all scaled by weight, number of
        transactions or both in all graphs. Also, they are colored from red to
        green depending on the satoshis/vByte ratio. In some cases, a scroll bar
        is needed to show the content guaranteeing all elements are clickable
        (at least 1px height).
      </Paragraph>
      <Paragraph>
        The small graph at the bottom left shows how much transaction weight has
        arrived in the last 10 minutes (average block time). This is a good
        indicator for the speed at which the mempool is filling: above 4M/10
        minutes the mempool is, in average, filling, and below that value, is
        emptying.
      </Paragraph>
      <Paragraph>
        Mempool is refreshed each 5 seconds as well as the position within the
        mempool of the selected transaction. Note that this period could be
        greater depending on workload to save bandwith. You can disable this
        refresh by checking <Typography component="span" sx={{fontStyle: "italic"}}>Lock mempool</Typography> in the
        upper right, this way you can navigate the transaction's dependency{" "}
        <CHashLink to="#txsGraphs">graph</CHashLink > (if any) without problems in
        case you have <Typography component="span" sx={{fontStyle: "italic"}}>Drag & Drop</Typography> checked.
      </Paragraph>
      <Paragraph>
        The algorithm for transaction selection in the{" "}
        <CHashLink to="/mempool">graph</CHashLink > takes into account transaction
        dependencies and{" "}
        <CHashLink to="#cpfp">
          CPFP
        </CHashLink >
        .
      </Paragraph>
      <H3>Terminology</H3>
      <Hook id="blockTemplate" ># Block template</Hook>
      <Paragraph>
        A block template is the list of transactions chosen by a miner from its
        mempool to be included into its next mined block. Normaly miners select
        the block template to maximize profits, but they can include its own
        transactions apart from coinbase, or follow state jurisdiction
        regulations.
      </Paragraph>
      <Hook id="conflictingTxs"># Conflicting Transactions</Hook>
      <Paragraph>
        Two or more transactions are conflicting if they spend the same UTXO
        (Unspent Transaction Output).
      </Paragraph>
      <Hook id="minerName"># Miner name</Hook>
      <Paragraph>
        Although mining is an anonymous process, mining pools often can be
        identified by a small text or character secuence left in the coinbase
        transaction, or by its output address.
      </Paragraph>
      <Paragraph>
        When a miner name cannot be identified, we treat it as{" "}
        <CHashLink to="/miner/unknown">
          unknown
        </CHashLink>
        . By hovering the mouse over a miner name, the coinbase transaction in
        hexadecimal is shown
      </Paragraph>
      <H4 id="txSelAlgo">Transaction selection algorithms:</H4>
      <Hook
        id="getBlockTemplateAlgorithm"
      ># GetBlockTemplate algorithm</Hook>
      <Paragraph>
        GetBlockTemplate is the name of the RPC exposed by a bitcoin node to
        miners to obtain a block template to be mined. The content returned
        changes each 30 seconds, and contains the list of transactions which
        maximizes profits, but limited by block size. Miners can use other
        methods to obtain a block template and its profit losses or gains are
        measured against our bitcoin node and algorithms{" "}
        <CHashLink to="/miner">here</CHashLink>.
      </Paragraph>
      <Hook id="onBlockArrivalAlgorithm">
        # On block arrival transaction selection algorithm
      </Hook>
      <Paragraph>
        In short, the "onBlockArrival" is an algorithm that sorts transactions
        in the usual greedy way: using the regular Ancestor Set Based (ASB)
        algorithm defined{" "}
        <Link href="https://gist.github.com/Xekyo/5cb413fe9f26dbce57abfd344ebbfaf2#file-candidate-set-based-block-building-md">here</Link>
        , and considering transaction dependencies and{" "}
        <CHashLink to="#cpfp">
          CPFP
        </CHashLink>
        . But this algorithm is executed by us when a block arrives to our node,
        and against the mempool before mined transactions are removed. Thus, it
        ignores getBlockTemplate pooling time and block template propagation
        time through mining infrastructure. But it does not ignore the
        propagation time of the mined block to us. Nevertheless, as we have the
        size of the mined block coinbase transaction, we can calculate with more
        accuracy the candidate block free space than with getBlockTemplate,
        resulting in a better comparison between candidate block and real mined
        block.
      </Paragraph>
      <H4>Transaction promotion in the mining queue</H4>
      <Paragraph>
        Nodes as Bitcoin Core allow transactions in mempool to be promoted in
        the mining queue by{" "}
        <CHashLink to="https://github.com/bitcoin/bips/blob/master/bip-0125.mediawiki">
          Bip-125 RBF
        </CHashLink>
        {" "}
        or by <Link href="https://bitcoinops.org/en/topics/cpfp/">CPFP</Link>
      </Paragraph>
      <Hook id="bip125"># Bip125 Replace By Fee</Hook>
      <Paragraph>
        Some wallets allows the creation of transactions that can be replaced in
        mempool by others with higher fees. See{" "}
        <Link href="https://github.com/bitcoin/bips/blob/master/bip-0125.mediawiki">
          Bip-125 RBF
        </Link>{" "}
        for details.
      </Paragraph>
      <Paragraph>
        Whether a transaction is replaceable or not is shown in the transaction
        details section, at the <CHashLink to="/mempool">mempool</CHashLink>.
        Also, a Bip-125 replaceable transaction is shown in the dependencies
        graph as a circle with dashed perimeter.
      </Paragraph>
      <Hook id="cpfp"># CPFP (Child Pays For Parent)</Hook>
      <Paragraph>
        A transaction in the mempool is dependant of other transaction also in
        the mempool if it spends an output of that other transaction. A
        dependant transaction is called a child, and it's dependency it's the
        parent. If a parent transaction has a low fee, and therefore is far
        behind in the mining queue, a depending transaction child can be created
        with higher fees so that the average result of adding weights and fees
        promotes both transactions within the mining queue. Details can be seen{" "}
        <Link href="https://bitcoinops.org/en/topics/cpfp/">here</Link>.
      </Paragraph>
      <Paragraph>
        A Bitcoin Core node allows by default the creation of Direct Acyclic
        Graphs (DAG) of depending transactions with a maximum deep of 25. Graphs
        with 2 or more transactions currently in the mempool are listed{" "}
        <CHashLink to="/txsGraphs">here</CHashLink>.
      </Paragraph>
      <Paragraph>
        Transactions with dependencies or dependant of others are shown at the{" "}
        <CHashLink to="/mempool">mempool</CHashLink> within a special section
        called dependencies graph, which draws the full graph on which the
        transaction is contained.
      </Paragraph>
      <H3>Transactions dependencies Graphs</H3>
      <Hook id="txsGraphs"># Selection</Hook>
      <Paragraph>
        This <CHashLink to="/txsGraphs">section</CHashLink> shows the list of
        transactions dependencies graphs currently in the mempool. These graphs
        can be linear: forming a long chain of dependencies, or non linear:
        forming a Direct Acyclic Graph.
      </Paragraph>
      <Paragraph>
        When clicked on the number of transactions on a graph, a list of the
        transactions id contained in that graph is shown. You can go to the
        graph by clicking any of these transactions id. The result is shown in
        the main page as if you had entered that transaction id manually.
      </Paragraph>
      <Hook id="txsGraphsRepresentation"># Representation</Hook>
      <Paragraph>
        {" "}
        The graph is made of nodes containing the first 4 letters of the
        transaction id they represents. The arrow denote the dependecy
        direction, beeing the pointed node the one on which depends the
        transaction on the other side of the arrow.
      </Paragraph>
      <Paragraph>
        When <Typography component="span" sx={{fontStyle: "italic"}}>Drag & Drop</Typography> is checked, you
        can move and fix in a place trasactions in case the automatic
        representation is crowding them together, be aware that in that case you
        might need check <Typography component="span" sx={{fontStyle: "italic"}}>Lock mempool</Typography> {" "}
        to avoid the continuous refreshing.
      </Paragraph>
      <Paragraph>
        When you click on a transaction node, That transaction is shown in the
        main page as if you had entered its transaction id manually.
      </Paragraph>
      <Paragraph>
        Also, the transactions are colored from red to green depending on the
        satoshis/vByte ratio whithin the dependency graph.
      </Paragraph>
      <H3 id="ignoredTransactions">Ignored transactions</H3>
      <Paragraph>
        As each miner has its own bitcoin node and infrastructure, there are
        different results for a{" "}
        <CHashLink to="#blockTemplate">
          block template
        </CHashLink>
        . In this <CHashLink to="igTx">section</CHashLink> are listed the
        transactions that has been included by us using a{" "}
        <CHashLink to="#txSelAlgo">
          transaction selection algorithm
        </CHashLink>{" "}
        but not has been included in a mined block.
      </Paragraph>
      <Paragraph>
        <Typography component="span" sx={{fontWeight: "bold"}}>Delta time</Typography> between a ignoring block and a ignored transaction by that
        block is the difference in time between both. Normally, a transaction is
        included in our template block but not in mined one due to transaction
        propagation time, but can be the case of a tx not included in a block
        for other reasons. We use the biggest delta for a ignored transaction to
        discern between the two cases.
      </Paragraph>
      <Paragraph>
        When clicking on a transaction id, the ignored transaction data are shown in the general view.
        Two variables are worth of explanation:
      </Paragraph>
      <Paragraph>
        <Typography component="span" sx={{fontWeight: "bold"}}>TotalSatoshi/vBytesLost</Typography> is the sum, for each ignoring block, of the difference between the sat/Vbyte of the transaction and the less paying sat/Vbyte transaction for each block.
        Thus, we obtain a measure of how much miners are loosing by not mining this transaction.
      </Paragraph>
      <Paragraph>
        <Typography component="span" sx={{fontWeight: "bold"}}>Total Fees Lost</Typography> is TotalSatoshivBytesLost multiplied by the transaction vSize. This is a total measure of the miners loss in satoshis.
      </Paragraph>
      <H3 id="missingTxs">Missing transactions</H3 >
      <Paragraph>
        We call missing to a transaction that has been ignored more than three
        times. This can happen for multiple reasons:
      </Paragraph>
      <List sx={{ml: 5}}>
        <ListItem>
          <Typography>
            * The transaction has not been propagated to the pool yet and three
            blocks has been mined in little time.
          </Typography>
        </ListItem>
        <ListItem>
          <Typography>
            * There can be multiple multiple{" "}
            <CHashLink to="#conflictingTxs">
              {" "}
              conflicting transactions
            </CHashLink>{" "}
            in different mempools, due to bitcoin nodes restart (see{" "}
            <Link href="https://bitcoin.stackexchange.com/questions/99717/transaction-being-ignored-by-miners-i-mean-ignored-not-not-mined-because-low">
              {" "}
              this thread
            </Link>{" "}
            for example), double spend attempts, or replacement transactions
            created via{" "}
            <CHashLink to="#bip125">
              Replace By Fee
            </CHashLink>
            .
          </Typography>
        </ListItem>
        <ListItem>
          <Typography>
            * The miners are adding its own transactions without broadcasting them
            to the network (see{" "}
            <Link href="https://bitcoin.stackexchange.com/questions/93471/ive-found-two-mined-txs-with-no-fee">
              this thread
            </Link>
            ), thus, occuping the block space of other transactions.
          </Typography>
        </ListItem>
        <ListItem>
          <Typography>
            * Miners are filtering sanctioned transactions as explained{" "}
            <Link href="https://miningpool.observer/faq#sanctioned">here</Link>
          </Typography>
        </ListItem>
      </List>
      <Paragraph>
        In the <CHashLink to="misTx">Missing Txs</CHashLink> section, the possible
        states for a missing transaction can be:
      </Paragraph>
      <TableContainer component={Paper} sx={{ml: 8, mb: 2, maxWidth: 500}}>
        <Table size="small" aria-label="Possible states">
          <TableBody>
            <TableRow >
              <TableCell>In Mempool</TableCell >
              <TableCell>Tx is currently in the mempool waiting to be mined</TableCell>
            </TableRow>
            <TableRow >
              <TableCell>Mined in block X</TableCell >
              <TableCell>Tx has been mined in block X</TableCell>
            </TableRow>
            <TableRow >
              <TableCell>Deleted</TableCell >
              <TableCell>
                Tx has been{" "}
                <Link href="https://bitcoin.stackexchange.com/questions/46152/how-do-transactions-leave-the-memory-pool">
                  deleted
                </Link>{" "}
                from mempool
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Paragraph>
        You can click the v symbol at the left of txId to see the list of
        blocks ignoring this transaction, along with other data regarding the
        position of this transaction in our candidate block, miner name, fees
        lost by the miners, time when should have been mined, etc.
      </Paragraph>
      <Paragraph>
        Transactions can be missing or not by comparing against different{" "}
        <CHashLink to="#txSelAlgo">
          selection algorithms
        </CHashLink>
        , you can change the algorithm in the combo box.
      </Paragraph>
      <H3 id="ignoringBlocksSection">Ignoring Blocks</H3>
      <Paragraph>
        <Typography component="span" sx={{fontWeight: "bold"}}>Note:</Typography> You cannot interpret these results to compare how good a
        mining pool is selecting its transactions against us because of the{" "}
        <CHashLink to="#methodology">
          methodology used
        </CHashLink>{" "}
        and some insolvable problems. We use the term{" "}
        <Typography component="span" sx={{fontStyle: "italic"}}>virtual</Typography> for "reward" or "lost reward"
        to point out that problems.
      </Paragraph>
      <Paragraph>
        Ignoring Blocks <CHashLink to="/blocks/BITCOIND">section</CHashLink> lists mined block
        data along with <Typography component="span" sx={{fontStyle: "italic"}}>virtual lost reward</Typography> due
        to{" "}
        <CHashLink to="#ignoredTransactions">
          ignored transactions
        </CHashLink>
        . By clicking on the block height, or{" "}
        <CHashLink to="#minerName">
          miner name
        </CHashLink>
        , additional details are shown. Negative{" "}
        <Typography component="span" sx={{fontStyle: "italic"}}>virtual lost reward</Typography> means better reward
        than us using the selected{" "}
        <CHashLink to="#txSelAlgo">
          algorithm
        </CHashLink>{" "}
        and our mempool.
      </Paragraph>
      <Paragraph>
        Additional details{" "}
        <CHashLink to="/block/last/BITCOIND">section</CHashLink> for a ignoring
        block shows a table with statistics about transactions when a mined
        block arrived:
      </Paragraph>
      <List sx={{ml: 5}}>
        <ListItem>
          * Whether the transaction was in our mempool, in mined block or in our
          candidate block in different combinations with different meanings.
        </ListItem>
        <ListItem>
          * Number of transactions, summation of weight and fees, and average
          sat/vByte for the transactions in that set.
        </ListItem>
      </List>

      <Paragraph>
        Additional details <CHashLink to="/miner/unknown">section</CHashLink> for
        a miner name shows the table with all bocks mined by that miner,
        including unknown miner names.
      </Paragraph>
      <H3 id="miners">Miners</H3>
      <Paragraph>
        <Typography component="span" sx={{fontWeight: "bold"}}>Note:</Typography> You cannot interpret these results to compare how good a
        mining pool is selecting its transactions against us because of the{" "}
        <CHashLink to="#methodology">
          methodology used
        </CHashLink>{" "}
        and some insolvable problems. We use the term{" "}
        <Typography component="span" sx={{fontStyle: "italic"}}>virtual</Typography> for "reward" or "lost reward"
        to point out that problems.
      </Paragraph>
      <Paragraph>
        Miners <CHashLink to="/miner">section</CHashLink> lists the accumulated
        block <Typography component="span" sx={{fontStyle: "italic"}}>reward lost</Typography> because of ignored
        transactions per miner name. Both{" "}
        <CHashLink to="#txSelAlgo">
          algorithms
        </CHashLink>{" "}
        are compared using the total and average{" "}
        <Typography component="span" sx={{fontStyle: "italic"}}>lost reward</Typography> per block.
      </Paragraph>
      <Paragraph>
        Only block data since bootstrap is shown.
      </Paragraph>
      <H3 id="methodology">Methodology</H3>
      <Paragraph>
        <Typography component="span" sx={{fontWeight: "bold"}}>Note:</Typography> There is currently a open question in stackexchange about
        the methodology that is used to measure miners lost revenue
        <Link href="https://bitcoin.stackexchange.com/questions/111940/is-there-a-way-to-know-how-good-a-miner-is-choosing-its-transanctions-to-be-mine">
          {" "}
          here
        </Link>
      </Paragraph>
      <Paragraph>
        For the <Link href="/blocks/BITCOIND">ignoring blocks</Link> and{" "}
        <CHashLink to="/miner">miners</CHashLink> section the methodology is as
        follows: when a mined block arrives to our node, we compare it against
        the last result of calling{" "}
        <CHashLink to="#getBlockTemplateAlgorithm">
          getBlockTemplate
        </CHashLink>{" "}
        and against an execution of{" "}
        <CHashLink to="#onBlockArrivalAlgorithm">
          onBlockArrival
        </CHashLink>{" "}
        algorithm. This could give us an idea about how good a miner is
        selecting its transactions, but as we have no way of knowing the state
        of the miner mempool before it mines a block, those sections are{" "}
        <Typography component="span" sx={{fontWeight: "bold"}}>inaccurate</Typography>.
      </Paragraph>
      <Paragraph>
        One can (and I did) make the assumption that received block and your
        block
        <CHashLink to="#blockTemplate">
          {" "}
          template
        </CHashLink>{" "}
        can be compared. But as the block propagation time is not, by any means,
        neglegible, the comparation is skewed giving the idea that our
        algorithms are better. The reality is that we are receiving transactions
        while the block is beeing propagated to us, and thus, we have normaly a
        bigger mempool than the miner when the block was mined. A bigger mempool
        gives our algoritms the oportunity to search for better transactions
        which had no opportunity to be mined in the former block.
      </Paragraph>
      <Paragraph>
        I keep those sections in the web page only in case somebody find them
        useful somehow.
      </Paragraph>
    </Container >
  );
}

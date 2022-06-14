import React, {useState} from "react";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {format} from "d3-format";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FilterListIcon from '@mui/icons-material/FilterList';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import {HeaderTableCell, StyledTableRow} from "../../utils/CommonComponents";
import Grid from "@mui/material/Grid"
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import {Link as LinkRR} from "react-router-dom";
import {CHashLink} from "../../utils/CommonComponents";
import {Amount} from "../Common/Amount";

const clone = require("rfdc")();

export function MinersStatsList(props) {

  const {minersStatsList, btcusd, algo, unit, setUnit} = props;

  const msList = clone(minersStatsList);
  addAvg(msList);

  const [selHeader, setSelHeader] = useState('nbm');
  const [asc, setAsc] = useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [headers, setHeaders] = React.useState(headersFrom(algo));
  const open = Boolean(anchorEl);

  msList.sort(dirSortFun);

  function addAvg(msList) {
    msList.forEach((miner) => {
      miner.afGBT = miner.tfGBT / Math.max(miner.nbm, 1);
      miner.afOBA = miner.tfOBA / Math.max(miner.nbm, 1);
      miner.alrGBT = miner.tlrGBT / Math.max(miner.nbm, 1);
      miner.alrOBA = miner.tlrOBA / Math.max(miner.nbm, 1);
      miner.aebm = miner.nebm / Math.max(miner.nbm, 1);
      miner.afnrtu = miner.tfnrtu / Math.max(miner.nbm, 1);
      miner.aflbebGBT = miner.tflbebGBT / Math.max(miner.nbm, 1);
      miner.aflbebOBA = miner.tflbebOBA / Math.max(miner.nbm, 1);
    });
  }

  function dirSortFun(a, b) {
    if (asc) return sortFun(a, b);
    return -sortFun(a, b);
  }

  function sortFun(msA, msB) {
    if (msB[selHeader] < msA[selHeader]) return -1;
    if (msB[selHeader] > msA[selHeader]) return 1;
    return 0;
  }

  function getDir() {
    if (asc === true) return 'asc';
    return 'desc';
  }

  const handleClickOrder = (header) => (event) => {
    onHandleClickOrder(event, header);
  }

  function onHandleClickOrder(event, header) {
    if (header.id === selHeader) {
      setAsc(!asc);
      return;
    }
    setSelHeader(header.id);
    setAsc(true);
  }

  const handleClickFilter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setAnchorEl(null);
  };

  function LinkTo(minerName) {
    if (minerName === "global_miner_name") {
      return (
        <TableCell><Link component={LinkRR} to="/blocks/BITCOIND">Global (all miners)</Link></TableCell>);
    } else if (minerName === "our_miner_name") {
      return (
        <TableCell>
          <CHashLink to="/faq#miners">Ourselves (when block arrives)</CHashLink>
        </TableCell>);
    } else {
      return (
        <TableCell>
          <Link component={LinkRR} to={"/miner/" + minerName} sx={{textTransform: "capitalize"}}>{minerName}</Link>
        </TableCell>
      );
    }
  }

  function NumMinedBlocks(nmb) {
    return (<TableCell>{format(",")(nmb)}</TableCell>);
  }

  function AmountCell(amount) {
    return (
      <TableCell>
        <Box textAlign="right">
          <Amount sats={amount} unit={unit} setUnit={setUnit} btcusd={btcusd} />
        </Box>
      </TableCell>
    );
  }
  function Cell(ms, id) {
    if (id === 'mn') return LinkTo(ms.mn);
    if (id === "nbm" || id === "nebm" || id === "aebm") return NumMinedBlocks(ms[id]);
    else return AmountCell(ms[id]);
  }

  function headersFrom() {
    const arr = [
      {id: 'mn', label: 'Miner Name', minWidth: 240, textAlign: "left", show: true},
      {id: 'nbm', label: '# Mined blocks', minWidth: 0, textAlign: "left", show: true},
      {id: 'nebm', label: '# Empty blocks', minWidth: 0, textAlign: "left", show: false},
      {id: 'aebm', label: 'Avg. Empty blocks', minWidth: 0, textAlign: "left", show: false},
      {id: 'tfnrtu', label: 'Total fees not relayed to us', minWidth: 180, textAlign: "right", show: false},
      {id: 'afnrtu', label: 'Avg. fees not relayed to us', minWidth: 180, textAlign: "right", show: false},
    ];
    return algo === "BITCOIND" ?
      [...arr,
      {id: 'tfGBT', label: 'Total fees (excluding block reward)', minWidth: 180, textAlign: "right", show: true},
      {id: 'afGBT', label: 'Avg. fees per block (excluding block reward)', minWidth: 150, textAlign: "right", show: true},
      {id: 'tlrGBT', label: 'Total lost reward', minWidth: 180, textAlign: "right", show: true},
      {id: 'alrGBT', label: 'Avg. lost reward per block', minWidth: 180, textAlign: "right", show: true},
      {id: 'tflbebGBT', label: 'Total fees lost by empty blocks', minWidth: 180, textAlign: "right", show: false},
      {id: 'aflbebGBT', label: 'Avg. fees lost by empty blocks', minWidth: 180, textAlign: "right", show: false},
      ] :
      [...arr,
      {id: 'tfOBA', label: 'Total fees (excluding block reward)', minWidth: 180, textAlign: "right", show: true},
      {id: 'afOBA', label: 'Avg. fees per block (excluding block reward)', minWidth: 150, textAlign: "right", show: true},
      {id: 'tlrOBA', label: 'Total lost reward', minWidth: 180, textAlign: "right", show: true},
      {id: 'alrOBA', label: 'Avg. lost reward per block', minWidth: 180, textAlign: "right", show: true},
      {id: 'tflbebOBA', label: 'Total fees lost by empty blocks', minWidth: 180, textAlign: "right", show: false},
      {id: 'aflbebOBA', label: 'Avg. fees lost by empty blocks', minWidth: 180, textAlign: "right", show: false},
      ];
  }

  function changeVisible(id, visible) {
    const newar = headers.map(header => {
      if (header.id === id) {header.show = visible; return header;}
      else return header;
    });
    setHeaders(newar);
  }

  const handleChange = (event) => {
    const id = event.target.id;
    const visible = event.target.checked;
    changeVisible(id, visible);
  };

  const handleDrop = (droppedItem) => {
    if (!droppedItem.destination) return;
    var updatedHeaders = [...headers];
    const [reorderedItem] = updatedHeaders.splice(droppedItem.source.index, 1);
    updatedHeaders.splice(droppedItem.destination.index, 0, reorderedItem);
    setHeaders(updatedHeaders);
  };

  return (

    <Box >
      <IconButton onClick={handleClickFilter}
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <FilterListIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseFilter}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <DragDropContext onDragEnd={handleDrop}>
          <Droppable droppableId="list-container">
            {(provided) => (
              <div
                className="list-container"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {headers.map((header, index) => (
                  <Draggable key={header.id} draggableId={header.id} index={index}>
                    {(provided) => (
                      <div
                        className="item-container"
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                      >
                        <MenuItem >
                          <DensityMediumIcon fontSize="small"/>
                          <Checkbox id={header.id} size="small" checked={header.show} onChange={handleChange} />
                          {header.label}
                        </MenuItem>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Menu>
      <Grid container justifyContent="center" sx={{margin: 2}} >
        <Grid item>
        </Grid>
        <Grid item>
          <TableContainer component={Paper}>
            <Table sx={{width: 800}} size="small" aria-label="BlockStatsList table">
              <TableHead>
                <TableRow >
                  {headers.filter((header) => {return header.show === true}).map((header) => (
                    <HeaderTableCell key={"TableCell" + header.id} sx={{minWidth: header.minWidth}}>
                      <TableSortLabel
                        active={header.id === selHeader}
                        direction={getDir()}
                        onClick={handleClickOrder(header)}>
                        {header.label}
                      </TableSortLabel>
                    </HeaderTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {msList.map((ms) => (
                  <StyledTableRow
                    key={ms.mn}
                  >
                    {headers.filter((header) => {return header.show === true;}).map((header) => (
                      < React.Fragment key={"Fragment" + header.id} >
                        {Cell(ms, header.id)}
                      </React.Fragment >
                    ))}
                  </StyledTableRow >
                )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box >
  );
}



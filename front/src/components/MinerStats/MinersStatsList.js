import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import Box from '@mui/material/Box';
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from "@mui/material/Typography";
import {format} from "d3-format";
import React, {useState} from "react";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {Link as LinkRR} from "react-router-dom";
import {CHashLink, HeaderTableCell, StyledTableRow} from "../../utils/CommonComponents";
import {Amount} from "../Common/Amount";

const clone = require("rfdc")();

export function MinersStatsList(props) {

  const {minersStatsList, btcusd, algo, unit, setUnit} = props;

  const [selHeader, setSelHeader] = useState('nbm');
  const [asc, setAsc] = useState(true);
  const [anchorSelCol, setAnchorSelCol] = React.useState(null);
  const [headers, setHeaders] = React.useState(headersFrom(algo));

  const openSelCol = Boolean(anchorSelCol);

  function changeList(list) {
    addAvg(list);
    const retList = addMods(list);
    retList.sort(dirSortFun);
    return retList;
  }

  function addMods(list) {
    var retList = clone(list);
    headers.forEach(header => {
      if (header.fun !== undefined) {
        //is an average
        list.forEach((ms, i) => {
          retList[i][header.id] = header.fun(ms, header);
        })
      } else {
        //is additive.
        if (header.mods !== undefined) {
          header.mods.forEach(mod => {
            if (mod.value === true) {
              list.forEach((ms, i) => {
                retList[i][header.id] += mod.fun(ms);
              })
            }
          })
        }
      }
    });
    return retList;
  }

  function addAvg(list) {
    list.forEach((miner) => {
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

  const handleClickSelCol = (event) => {
    setAnchorSelCol(event.currentTarget);
  };

  const handleCloseSelCol = () => {
    setAnchorSelCol(null);
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

  function AvgEmptyBlocks(nmb) {
    return (<TableCell>{format(",.2f")(nmb * 100) + "%"}</TableCell>);
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

  function OptCell(header) {
    if (header.mods === undefined)
      return null;
    else return (
      <List>
        {header.mods.map((mod) => {
          return (<ListItem key={mod.label} sx={{p: 0}}>
            <Checkbox id={header.id + "." + mod.id} size="small" checked={mod.value} onChange={handleChangeValue} sx={{p: 0}} />
            <Typography variant="caption" color="darkgrey">{mod.label}</Typography>
          </ListItem>);
        })}
      </List>
    )
  }

  function Cell(ms, header) {
    const id = header.id;
    const value = ms[header.id];
    if (id === 'mn') return LinkTo(value);
    if (id === "nbm" || id === "nebm") return NumMinedBlocks(value);
    if (id === "aebm") return AvgEmptyBlocks(value);
    else return AmountCell(value);
  }

  function headersFrom() {
    const arr = [
      {id: 'mn', label: 'Mining pool', minWidth: 240, textAlign: "left", show: true},
      {
        id: 'nbm', label: '# Mined blocks', minWidth: 160, textAlign: "left", show: true, mods: [
          {id: 'eeb', fun: (ms) => - ms.nebm, label: "Excl. Empty Blocks", value: false}
        ]
      },
      {id: 'nebm', label: '# Empty blocks', minWidth: 0, textAlign: "left", show: false},
      {id: 'aebm', label: 'Avg. Empty blocks', minWidth: 0, textAlign: "left", show: false},
      {id: 'tfnrtu', label: 'Total fees not relayed to us', minWidth: 180, textAlign: "right", show: false},
      {id: 'afnrtu', label: 'Avg. fees not relayed to us', minWidth: 180, textAlign: "right", show: false},
      {id: 'tfbbr', label: 'Total subsidy', minWidth: 180, textAlign: "", show: false},
    ];
    return algo === "BITCOIND" ?
      [...arr,
      {
        id: 'tfGBT', label: 'Total fees', minWidth: 180, textAlign: "right", show: true, mods: [
          {id: 'abr', fun: (ms) => ms.tfbbr, label: 'Add block subsidy', value: false},
          {id: 'enrtu', fun: (ms) => -ms.tfnrtu, label: 'Exc. Not relayed to us', value: true},
        ]
      },
      {
        id: 'afGBT', fun: (ms, h) => avgFees(ms, h), label: 'Avg. fees per block', minWidth: 180, textAlign: "right", show: true, mods: [
          {id: 'abr', label: 'Add block subsidy', value: false},
          {id: 'enrtu', label: 'Exc. Not relayed to us', value: true},
          {id: 'eeb', label: 'Exc. Empty Blocks', value: true},
        ]
      },
      {
        id: 'tlrGBT', label: 'Total fees lost', minWidth: 180, textAlign: "right", show: true, mods: [
          {id: 'enrtu', fun: (ms) => ms.tfnrtu, label: 'Exc. fees not relayed to us', value: true},//ms.tfnrtu is positive, not negative
        ]
      },
      {
        id: 'alrGBT', fun: (ms, h) => avgLR(ms, h), label: 'Avg. fees lost per block', minWidth: 180, textAlign: "right", show: true, mods: [
          {id: 'enrtu', label: 'Exc. fees not relayed to us', value: true},
        ]
      },
      {id: 'tflbebGBT', label: 'Total fees lost by empty blocks', minWidth: 180, textAlign: "right", show: false},
      {id: 'aflbebGBT', fun: (ms, h) => ms.aflbebGBT, label: 'Avg. fees lost by empty blocks', minWidth: 180, textAlign: "right", show: false},
      ] :
      [...arr,
      {
        id: 'tfOBA', label: 'Total fees', minWidth: 180, textAlign: "right", show: true, mods: [
          {id: 'abr', fun: (ms) => ms.tfbbr, label: 'Add block subsidy', value: false},
          {id: 'enrtu', fun: (ms) => -ms.tfnrtu, label: 'Exc. Not relayed to us', value: true},
        ]
      },
      {
        id: 'afOBA', fun: (ms, h) => avgFees(ms, h), label: 'Avg. fees per block', minWidth: 180, textAlign: "right", show: true, mods: [
          {id: 'abr', label: 'Add block subsidy', value: false},
          {id: 'enrtu', label: 'Exc. Not relayed to us', value: true},
          {id: 'eeb', label: 'Exc. Empty Blocks', value: true},
        ]
      },
      {
        id: 'tlrOBA', label: 'Total fees lost', minWidth: 180, textAlign: "right", show: true, mods: [
          {id: 'enrtu', fun: (ms) => ms.tfnrtu, label: 'Exc. fees not relayed to us', value: true},//ms.tfnrtu is positive, not negative
        ]
      },
      {
        id: 'alrOBA', fun: (ms, h) => avgLR(ms, h), label: 'Avg. fees lost per block', minWidth: 180, textAlign: "right", show: true, mods: [
          {id: 'enrtu', label: 'Exc. fees not relayed to us', value: true},
        ],
      },
      {id: 'tflbebOBA', label: 'Total fees lost by empty blocks', minWidth: 180, textAlign: "right", show: false},
      {id: 'aflbebOBA', fun: (ms, h) => ms.aflbebOBA, label: 'Avg. fees lost by empty blocks', minWidth: 180, textAlign: "right", show: false},
      ];
  }

  function avgLR(ms, h) {
    const excNRTU = h.mods[0].value;
    const totalNRTU = ms.tfnrtu;
    var totalLostReward = excNRTU ? totalNRTU : 0;
    if (h.id === 'alrGBT') {
      totalLostReward += ms.tlrGBT;
      // return ms.alrGBT;
      return totalLostReward / Math.max(ms.nbm, 1);
    } else if (h.id === 'alrOBA') {
      totalLostReward += ms.tlrOBA;
      // return ms.alrOBA;
      return totalLostReward / Math.max(ms.nbm, 1);
    }
  }

  function avgFees(ms, h) {
    const addBR = h.mods[0].value;
    const excNRTU = h.mods[1].value;
    const excEB = h.mods[2].value;
    const blockReward = ms.tfbbr;
    const totalNRTU = ms.tfnrtu;
    var numBlocksMined = ms.nbm;
    var totalFee = addBR ? blockReward : 0;
    totalFee -= excNRTU ? totalNRTU : 0;
    numBlocksMined -= excEB ? ms.nebm : 0;

    if (h.id === 'afGBT') {
      totalFee += ms.tfGBT;
      return totalFee / Math.max(numBlocksMined, 1);
    } else if (h.id === 'afOBA') {
      totalFee += ms.tfOBA;
      return totalFee / Math.max(numBlocksMined, 1);
    }
  }

  function changeVisible(id, visible) {
    const newar = headers.map(header => {
      if (header.id === id) {header.show = visible; return header;}
      else return header;
    });
    setHeaders(newar);
  }

  function changeValue(headerId, modId, value) {
    const newar = headers.map(header => {
      if (header.id === headerId) {
        header.mods.map((mod) => {
          if (mod.id === modId) {
            mod.value = value;
          }
        });
        return header;
      }
      else return header;
    });
    setHeaders(newar);
  }

  const handleChangeVisible = (event) => {
    const id = event.target.id;
    const visible = event.target.checked;
    changeVisible(id, visible);
  };



  const handleChangeValue = (event) => {
    const id = event.target.id;
    const arrId = id.split(".");
    const headerId = arrId[0];
    const modId = arrId[1];
    const value = event.target.checked;
    changeValue(headerId, modId, value);
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
      <Menu
        id="basic-menu"
        anchorEl={anchorSelCol}
        open={openSelCol}
        onClose={handleCloseSelCol}
        MenuListProps={{
          'dense': true
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
                        <MenuItem>
                          <DensityMediumIcon fontSize="small" />
                          <Checkbox id={header.id} size="small" checked={header.show} onChange={handleChangeVisible} />
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

      <Grid container direction="column" justifyContent="flex-start" alignItems="center" sx={{margin: 2}} >
        <Grid item>
          <TableContainer component={Paper}>
            <Table sx={{width: 800}} size="small" aria-label="BlockStatsList table">
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Box>
                      <Typography component="span">COLUMNS:</Typography>
                      <IconButton onClick={handleClickSelCol}
                        id="basic-button"
                      >
                        <ViewWeekIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
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
                              {OptCell(header)}
                            </HeaderTableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {changeList(clone(minersStatsList)).map((ms) => (
                          <StyledTableRow
                            key={ms.mn}
                          >
                            {headers.filter((header) => {return header.show === true;}).map((header) => (
                              < React.Fragment key={"Fragment" + header.id} >
                                {Cell(ms, header)}
                              </React.Fragment >
                            ))}
                          </StyledTableRow >
                        )
                        )}
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box >
  );
}



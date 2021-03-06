// Source code for the Axlib Telemetry Server.
// Copyright (C) 2021 AXIA Technologies (UK) Ltd.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

import * as React from 'react';
import { Types, Maybe } from '../../common';
import { Node } from '../../state';
import { Persistent, PersistentSet } from '../../persist';
import {
  Column,
  NameColumn,
  ValidatorColumn,
  LocationColumn,
  ImplementationColumn,
  NetworkIdColumn,
  PeersColumn,
  TxsColumn,
  UploadColumn,
  DownloadColumn,
  StateCacheColumn,
  BlockNumberColumn,
  BlockHashColumn,
  FinalizedBlockColumn,
  FinalizedHashColumn,
  BlockTimeColumn,
  BlockPropagationColumn,
  LastBlockColumn,
  UptimeColumn,
} from './';

import './Row.css';

export namespace Row {
  export interface Props {
    node: Node;
    pins: PersistentSet<Types.NodeName>;
    columns: Column[];
  }

  export interface State {
    update: number;
  }
}

interface HeaderProps {
  columns: Column[];
  sortBy: Persistent<Maybe<number>>;
}

export class Row extends React.Component<Row.Props, Row.State> {
  public static readonly columns: Column[] = [
    NameColumn,
    ValidatorColumn,
    LocationColumn,
    ImplementationColumn,
    NetworkIdColumn,
    PeersColumn,
    TxsColumn,
    UploadColumn,
    DownloadColumn,
    StateCacheColumn,
    BlockNumberColumn,
    BlockHashColumn,
    FinalizedBlockColumn,
    FinalizedHashColumn,
    BlockTimeColumn,
    BlockPropagationColumn,
    LastBlockColumn,
    UptimeColumn,
  ];

  private renderedChangeRef = 0;

  public shouldComponentUpdate(nextProps: Row.Props): boolean {
    return (
      this.props.node.id !== nextProps.node.id ||
      this.renderedChangeRef !== nextProps.node.changeRef
    );
  }

  public render() {
    const { node, columns } = this.props;

    this.renderedChangeRef = node.changeRef;

    let className = 'Row';

    if (node.propagationTime != null) {
      className += ' Row-synced';
    }

    if (node.pinned) {
      className += ' Row-pinned';
    }

    if (node.stale) {
      className += ' Row-stale';
    }

    return (
      <tr className={className} onClick={this.toggle}>
        {columns.map((col, index) =>
          React.createElement(col, { node, key: index })
        )}
      </tr>
    );
  }

  public toggle = () => {
    const { pins, node } = this.props;

    if (node.pinned) {
      pins.delete(node.name);
    } else {
      pins.add(node.name);
    }
  };
}

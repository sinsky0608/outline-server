// Copyright 2018 The Outline Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {AccessKeyId} from './access_key';

export type LastHourMetricsReadyCallback = (startDatetime: Date, endDatetime: Date, lastHourUserStats: Map<AccessKeyId, PerUserStats>) => void;

// TODO: replace "user" with "access key" in metrics.  This may also require changing
// - the metrics server
// - the metrics bigquery tables
// - the persisted metrics format (JSON file).
export interface Stats {
  // Record the number of bytes transferred for a user, and include known
  // client IP addresses that are connected for that user.  If there are >1
  // IP addresses, numBytes is the sum of bytes transferred across all of those
  // clients - we do not know the breakdown of how many bytes were transferred
  // per IP address, due to limitations of the ss-server.  ipAddresses are only
  // used for recording which countries clients are connecting from.
  recordBytesTransferred(userId: AccessKeyId, metricsUserId: AccessKeyId, numBytes: number, ipAddresses: string[]);
  // Get 30 day data usage, broken down by userId.
  get30DayByteTransfer(): DataUsageByUser;
  // Register callback for hourly metrics report.
  onLastHourMetricsReady(callback: LastHourMetricsReadyCallback): void;
}

export interface PerUserStats {
  bytesTransferred: number;
  anonymizedIpAddresses: Set<string>;
}

// Byte transfer stats for the past 30 days, including both inbound and outbound.
// TODO: this is copied at src/model/server.ts.  Both copies should
// be kept in sync, until we can find a way to share code between the web_app
// and shadowbox.
export interface DataUsageByUser {
  // The userId key should be of type AccessKeyId, however that results in the tsc
  // error TS1023: An index signature parameter type must be 'string' or 'number'.
  // See https://github.com/Microsoft/TypeScript/issues/2491
  // TODO: rename this to AccessKeyId in a backwards compatible way.
  bytesTransferredByUserId: {[userId: string]: number};
}

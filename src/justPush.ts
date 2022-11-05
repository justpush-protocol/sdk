import {
  AddNotificationRequest,
  AddNotificationResponse,
  GetNotificationsRequest,
  GetNotificationsResponse,
  ListGroupRequest,
  ListGroupResponse,
  SubscribeRequest,
  SubscribeResponse,
  UnsubscribeRequest,
  UnsubscribeResponse,
  Notification,
} from "@justpush/api-types";
import axios from "axios";

import { signMessage } from "./utils";
import {
  ApolloClient,
  FetchResult,
  Observable,
  InMemoryCache,
  gql,
} from "@apollo/client/core";
import { WebSocket } from "ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";

import { createClient } from "graphql-ws";

const JUST_PUSH_API_URL = "https://api.justpush.app/v1/";
const JUST_PUSH_WS_URL = "ws://api.justpush.app/v1/graphql";

const NOTIFICATION_SUBSCRIPTION = gql`
  subscription OnNotificationAdded($userId: String!) {
    notificationAdded(userId: $userId) {
      id
      timestamp
      group {
        id
        name
        owner
        description
        image
      }
      data {
        title
        content
        link
      }
    }
  }
`;

/**
 * JustPush client
 *
 * Start by creating a new instance of the JustPush client.
 * You can use the `new` keyword like any other class.
 *
 * The constructor takes a single argument, which is tronweb instance.
 * If you are on the browser, you can use `window.tronWeb` instead. Otherwise, you can use `require("tronweb")`.
 *
 * ```ts
 * import { JustPush } from "@justpush/sdk";
 * import TronWeb from "tronweb";
 *
 * const tronWeb = new TronWeb({
 *  fullHost: "https://api.trongrid.io",
 *  privateKey: "YOUR_PRIVATE_KEY",
 * });
 *
 * const justPush = new JustPush(tronWeb);
 * ```
 */
export class JustPush {
  readonly tronWeb: any;
  readonly address: string;
  readonly endpoint: string;
  private graphqlClient: ApolloClient<any>;

  public constructor(tronWeb: any) {
    this.tronWeb = tronWeb;
    this.address = tronWeb.defaultAddress.base58;
    this.endpoint = JUST_PUSH_API_URL;
    this.graphqlClient = new ApolloClient({
      link: new GraphQLWsLink(
        createClient({
          webSocketImpl: WebSocket,
          url: JUST_PUSH_WS_URL,
        })
      ),
      cache: new InMemoryCache(),
    });
  }

  public async listGroups(request: ListGroupRequest) {
    const response = await axios.post<ListGroupResponse>(
      `${this.endpoint}/unsigned/group/list`,
      request,
      {
        headers: {
          "Content-Type": "application/json",
          "x-public-key": this.address,
        },
      }
    );
    return response.data;
  }

  public async listNotifications(request: GetNotificationsRequest) {
    const response = await axios.post<GetNotificationsResponse>(
      `${this.endpoint}/unsigned/notification/list`,
      request,
      {
        headers: {
          "Content-Type": "application/json",
          "x-public-key": this.address,
        },
      }
    );
    return response.data;
  }

  public async subscribe(request: SubscribeRequest) {
    const signature = await signMessage(JSON.stringify(request), this.tronWeb);
    const response = await axios.post<SubscribeResponse>(
      `${this.endpoint}/signed/group/subscribe`,
      request,
      {
        headers: {
          "Content-Type": "application/json",
          "x-public-key": this.address,
          "x-signature": signature,
        },
      }
    );

    return response.data;
  }

  public async unsubscribe(request: UnsubscribeRequest) {
    const signature = await signMessage(JSON.stringify(request), this.tronWeb);
    const response = await axios.post<UnsubscribeResponse>(
      `${this.endpoint}/signed/group/unsubscribe`,
      request,
      {
        headers: {
          "Content-Type": "application/json",
          "x-public-key": this.address,
          "x-signature": signature,
        },
      }
    );

    return response.data;
  }

  public async sendNotification(request: AddNotificationRequest) {
    const signature = await signMessage(JSON.stringify(request), this.tronWeb);

    const response = await axios.post<AddNotificationResponse>(
      `${this.endpoint}/signed/notification/new`,
      request,
      {
        headers: {
          "Content-Type": "application/json",
          "x-public-key": this.address,
          "x-signature": signature,
        },
      }
    );

    return response.data;
  }

  public monitorNotifcations(userId: string): Observable<
    FetchResult<{
      notificationAdded: Notification;
    }>
  > {
    return this.graphqlClient.subscribe({
      query: NOTIFICATION_SUBSCRIPTION,
      variables: {
        userId,
      },
    });
  }
}

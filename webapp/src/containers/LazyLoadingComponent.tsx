import * as React from 'react'

import { Localisable } from '../locales'
import { Callbacks } from '../actions/data'

import Refresh from '../components/Refresh'

export enum LoadingState {
  DataAvailable = 1,
  LoadingInProgress,
  NoDataLoaded,
  // TODO: allow more control here and define a few more specific states
}

export class LazyLoadingComponent<Props extends Localisable, State> extends
    React.Component<Props, State> {

  loadingState: LoadingState = LoadingState.DataAvailable
  refreshComponent = <div></div>

  constructor(props: Props) {
    super(props)
    console.log('LazyLoadingComponent constructing')
    this.requestData = this.requestData.bind(this)
    this.refreshComponent =
        <Refresh l={this.props.l} refresh={this.requestData} />
  }

  render() {

    console.log('LazyLoadingComponent rendering')

    if (this.loadingInProgress())
      return this.renderLoading()

    if (this.noDataLoaded())
      return this.renderNoData()

    return this.renderWithData()
  }

  renderLoading() {
    let l = this.props.l
    return (
      <div>
        <div>{ l('LOADING', 'Loading ...') }</div>
        { this.refreshComponent }
      </div>
    )
  }

  renderNoData() {
    let l = this.props.l
    return (
      <div>
        <div>{ l('NO_DATA', 'No data available.') }</div>
        { this.refreshComponent }
      </div>
    )
  }

  renderWithData() {
    // override in implementation!
    return <div>Data available!</div>
  }

  getRequiredProps(): string[] {
    // override in implementation!
    return []
  }

  requestData(): void {
    // override in implementation!
  }

  onRequestDataSuccess(): void {
    console.log('Successfully retrieved data for LazyLoadingComponent')
    if (this.loadingState == LoadingState.DataAvailable) {
      return
    }
    if (this.allRequiredPropsProvided()) {
      this.loadingState = LoadingState.DataAvailable
      this.forceUpdate()
    } else {
      console.log('However, apparently not all reqiured data was available')
      this.loadingState = LoadingState.NoDataLoaded
      this.forceUpdate()
    }
  }

  onRequestDataError(): void {
    console.log('Error retrieving data for LazyLoadingComponent')
    if (this.loadingState == LoadingState.DataAvailable) {
      return
    }
    this.loadingState = LoadingState.NoDataLoaded
    this.forceUpdate()
  }

  requestDataCallbacks: Callbacks = {
    onSuccess: () => this.onRequestDataSuccess(),
    onError: () => this.onRequestDataError(),
  }

  loadingInProgress(): boolean {
    return this.loadingState == LoadingState.LoadingInProgress
  }

  noDataLoaded(): boolean {
    return this.loadingState == LoadingState.NoDataLoaded
  }

  componentWillMount() {
    console.log('LazyLoadingComponent mounting')
    if (!this.allRequiredPropsProvided()) {
      console.log('required props are missing, will request data')
      this.loadingState = LoadingState.LoadingInProgress
      this.requestData()
      return
    }
    if (this.shouldRefreshOnMount()) {
      console.log('required props are available, but should refresh')
      this.requestData()
    }
  }

  allRequiredPropsProvided() {
    let providedProps: { [key: string]: any } = this.props
    let requiredProps = this.getRequiredProps()
    for (var i = 0; i < requiredProps.length; i++) {
      let key = requiredProps[i]
      if (!providedProps[key]) {
        console.log('prop is missing:', key)
        return false
      }
    }
    return true
  }

  shouldRefreshOnMount() {
    // override in implementation!
    return false
  }
}

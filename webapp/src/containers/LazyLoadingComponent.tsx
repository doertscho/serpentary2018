import * as React from 'react'

export enum LoadingState {
  DataAvailable = 1,
  LoadingInProgress,
  NoDataLoaded
}

export class LazyLoadingComponent<Props, State> extends
    React.Component<Props, State> {

  loadingState: LoadingState = LoadingState.DataAvailable

  render() {

    console.log('LazyLoadingComponent rendering')

    if (this.loadingInProgress())
      return this.renderLoading()

    if (this.noDataLoaded())
      return this.renderNoData()

    return this.renderWithData()
  }

  renderLoading() {
    return <div>Loading ...</div>
  }

  renderNoData() {
    return <div>Not found.</div>
  }

  renderWithData() {
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
    console.log('onRequestDataSuccess called')
    if (this.allRequiredPropsProvided()) {
      this.loadingState = LoadingState.DataAvailable
    } else {
      this.loadingState = LoadingState.NoDataLoaded
    }
    this.forceUpdate()
  }

  onRequestDataError(): void {
    console.log('onRequestDataError called')
    this.loadingState = LoadingState.NoDataLoaded
    this.forceUpdate()
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
      this.loadingState = LoadingState.LoadingInProgress
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
}

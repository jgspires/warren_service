export interface IUseCase<Props = null, Response = null> {
  execute(props: Props): Promise<Response>
}

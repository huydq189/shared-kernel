import {IAggregateRoot} from '../aggregates';
import {ICreateRepository} from './create';
import {IDeleteRepository} from './delete';
import {IReadOneRepository} from './read';
import {IUpdateRepository} from './update';

export interface IRepository<TAggregateRoot extends IAggregateRoot, TId>
  extends ICreateRepository<TAggregateRoot>,
    ICreateRepository<TAggregateRoot>,
    IReadOneRepository<TAggregateRoot, TId>,
    IUpdateRepository<TAggregateRoot>,
    IDeleteRepository<TAggregateRoot> {}

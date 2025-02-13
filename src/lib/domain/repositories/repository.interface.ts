import {IAggregateRoot} from '../aggregates';
import {ICreateRepository} from './create/create-repository.interface';
import {IDeleteRepository} from './delete/delete-repository.interface';
import {IReadOneRepository} from './read/read-one.interface';

export interface IRepository<TAggregateRoot extends IAggregateRoot, TId>
  extends ICreateRepository<TAggregateRoot>,
    IReadOneRepository<TAggregateRoot, TId>,
    ICreateRepository<TAggregateRoot>,
    IDeleteRepository<TAggregateRoot> {}

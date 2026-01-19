//Encodes business rules for moving between states (e.g., can’t go from FAILED → CONFIRMED directly)
import {Order} from './order.entity';
import { OrderStates,  } from './order.state-machine';

const allowedTransitions = {
    [OrderStates.CREATED]: [OrderStates.PROCESSING], //
    [OrderStates.PROCESSING]: [OrderStates.COMPLETED, OrderStates.FAILED],
    [OrderStates.FAILED]: [OrderStates.RETRYING],
    [OrderStates.RETRYING]: [OrderStates.PROCESSING],
    [OrderStates.COMPLETED]: []
};


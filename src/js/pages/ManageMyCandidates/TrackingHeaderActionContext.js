import { createContext } from 'react';

/**
 * Holds a DOM node (the slot inside SupporterTracking's TabRow) into which the
 * active subtab portals its desktop "Send / Resend ... to selected (N)" button.
 * Null when the slot isn't mounted yet (e.g., on mobile, or pre-mount).
 */
const TrackingHeaderActionContext = createContext(null);

export default TrackingHeaderActionContext;

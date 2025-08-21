import React from 'react'
import { useSubscription } from '../../hooks/useSubscription'

const SubscriptionInfo = () => {
    const { subscription, credits, plan, status, isActive, updateSubscription } = useSubscription()

    const handleUpdateCredits = (newCredits) => {
        updateSubscription({ credits: newCredits })
    }

    return (
        <div className="subscription-info">
            <h3>Subscription Details</h3>
            <p>Plan: {plan || 'No Plan'}</p>
            <p>Status: {status || 'Inactive'}</p>
            <p>Credits: {credits}</p>
            <p>Active: {isActive ? 'Yes' : 'No'}</p>
            
            {/* Example of updating subscription */}
            <button onClick={() => handleUpdateCredits(credits + 10)}>
                Add 10 Credits
            </button>
        </div>
    )
}

export default SubscriptionInfo
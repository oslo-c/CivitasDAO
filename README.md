So the simple fact of the matter is that I have been working on this idea for the last 36 hours straight. Most of my work is probably shit, because I had to quick learn javascript, npm, hardhat, and other project dependencies
I am very tired and I am going to go to bed soon, but the basic idea is this:
This system is an ERC-20 token with a public voting mechanism to adjust parameters—mint rate, burn rate, or pause state—once every set time interval (e.g., every minute). 

During the interval, users cast votes by spending tokens. All tokens spent on voting are burned upon finalization of the interval. All mints are distributed according to historic voting rate at the end of each interval. 

Votes can increase or decrease the mint size, increase or decrease the burn rate (i.e. price to vote), or pause the system for a cool-down period. At the end of the interval, the contract looks at the net votes for all three mechanics. It identifies which mechanic has the largest absolute net vote count and applies that change:

If the mint mechanic wins, a positive net increases the mint rate, a negative net decreases it.
If the burn mechanic wins, a positive net increases the burn rate, a negative net decreases it.
If the pause mechanic wins, a positive net initiates a pause for a set time (60 minutes).

If no mechanic has a positive or negative advantage, nothing changes. After applying the chosen change, all votes reset and the process repeats for the next interval.

The system has no fail-safe... the currency can become hyperinflated, (although it cannot really be brought to zero).

Choose wisely.

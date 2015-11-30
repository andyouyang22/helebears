
module.exports = {
	/**
	 * Return a dictionary containing parsed time information. An example input
	 * string is "TR 1400 1530".
	 */
	parse: function(t) {
		var tokens = t.split(" ");
		return {
			days  : tokens[0],
			start : tokens[1],
			end   : tokens[2]
		};
	},
	/**
	 * Return the AM/PM formatted string of a military-time input. For example, if
	 * the input string was "1400", the function would return "2:00 pm"
	 */
	display: function(t) {
		var hour = t.substring(0, 2);
		var min  = t.substring(2, 4);
		var suffix = "am";

		var hour = parseInt(hour);

		if (hour >= 12) {
			suffix = "pm";
			hour -= 12;
		}
		if (hour == 0) {
			hour = "12";
		}

		return hour + ":" + min + suffix
	},
	/**
	 * Return the number of minutes between 'start' and 'end'. Behavior is
	 * undefined if 'start' comes after 'end'.
	 */
	duration: function(start, end) {
		var dur = parseInt(end) - parseInt(start);
		return Math.floor(dur / 100) * 60 + ((dur % 100 != 0) ? 30 : 0);
	},
	/**
	 * Return true if courses 'a' and 'b' conflict, including when 'a' and 'b' are
	 * the same class (same CCN); return false otherwise.
	 */
	conflict: function(a, b) {
		if (a.ccn == b.ccn) {
			return true;
		}
		at  = this.parse(a.time);
		bt  = this.parse(b.time);
		// 'days' should only have length 1 for both 'at' and 'bt'
		if (at.days != bt.days) {
			return false;
		}
		var aStart = parseInt(at.start);
		var aEnd   = parseInt(at.end);
		var bStart = parseInt(bt.start);
		var bEnd   = parseInt(bt.end);
		if (aStart >= bStart && aStart < bEnd) {
			return true;
		} else if (bStart >= aStart && bStart < aEnd) {
			return true;
		}
		return false;
	},
};

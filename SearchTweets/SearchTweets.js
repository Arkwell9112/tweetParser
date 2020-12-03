/**
*	tweets : tableau des tweets a filtrer
*	criterias : list of all criteria to match
		criteriaName : name of the tweet attribute to look at
		value : value to check, must be numbers if checking number, string if checking strings, etc
		operand : OPTIONAL : check to perform between the tweet's attribute and the value. Default equals
		fncOperand : OPTIONAL : function to perform between the tweet's attribute and the value
		one of operand or fncOperand  must be given
*/
function searchByCriteria(tweets, criterias){
	let matchingCriterias = tweets;
	criterias.forEach(criteria => {
		let isFillingCriteriaFnc = criteria.fncOperand ? criteria.fncOperand : getFunctionFor(criteria.operand);
		tweets = tweets.filter(tweet => isFillingCriteriaFnc(tweet, criteria.criteriaName, criteria.value));
	})
	return tweets;
}

function getFunctionFor(operand){
	
	let fnc;
	
	switch(operand){
		
		case "=" :
		case "equ" :
		case "equals" :
			fnc = (tweet, criteriaName, value) => (isNaN(tweet[criteriaName]) ? (tweet[criteriaName] === value) : (parseFloat(tweet[criteriaName]) === value));
			break;
		
		case "!=" : 
		case "neq" : 
		case "notEquals" : 
			fnc = (tweet, criteriaName, value) => (isNaN(tweet[criteriaName]) ? (tweet[criteriaName] !== value) : (parseFloat(tweet[criteriaName]) !== value));
			break;
			
		case ">" :
		case "gtr" : 
		case "greaterThan" : 
			fnc = (tweet, criteriaName, value) => (isNaN(tweet[criteriaName]) ? (tweet[criteriaName] > value) : (parseFloat(tweet[criteriaName]) > value));
			break;
			
		case ">=" :
		case "geq" : 
		case "greaterThanOrEquals" : 
			fnc = (tweet, criteriaName, value) => (isNaN(tweet[criteriaName]) ? (tweet[criteriaName] >= value) : (parseFloat(tweet[criteriaName]) >= value));
			break;
			
		case "<" :
		case "lss" :
		case "lessThan" : 
			fnc = (tweet, criteriaName, value) => (isNaN(tweet[criteriaName]) ? (tweet[criteriaName] < value) : (parseFloat(tweet[criteriaName]) < value));
			break;
			
		case "<" :
		case "leq" :
		case "lessThanOrEquals" : 
			fnc = (tweet, criteriaName, value) => (isNaN(tweet[criteriaName]) ? (tweet[criteriaName] <= value) : (parseFloat(tweet[criteriaName]) <= value));
			break;
			
		case "oneOf" : 
			fnc = (tweet, criteriaName, values) => (values.includes(tweet[criteriaName]));
			break;
		
		case "between" :
			fnc = (tweet, criteriaName, values) => (isNaN(tweet[criteriaName]) ? (values[0] <= tweet[criteriaName] && values[1] >= tweet[criteriaName] ) : (values[0] <= parseFloat(tweet[criteriaName]) && values[1] >= parseFloat(tweet[criteriaName]) ) );
			break;
			
		case "notBetween" :
			fnc = (tweet, criteriaName, values) => (isNaN(tweet[criteriaName]) ? (values[0] > tweet[criteriaName] && values[1] < tweet[criteriaName] ) : (values[0] > parseFloat(tweet[criteriaName]) && values[1] < parseFloat(tweet[criteriaName]) ) );
			break;
		
		case "dateEquals":
			fnc = (tweet, criteriaName, value) => ( new Date(tweet[criteriaName]).toISOString() === new Date(value).toISOString());
			break;
		
		case "dateBetween":
			fnc = (tweet, criteriaName, values) => ( new Date(values[0]) <= new Date(tweet[criteriaName]) && new Date(values[1]) >= new Date(tweet[criteriaName]));
			break;
			
		case "dateNotBetween":
			fnc = (tweet, criteriaName, values) => ( new Date(values[0]) > new Date(tweet[criteriaName]) && new Date(values[1]) < new Date(tweet[criteriaName]));
			break;
			
		default : 
			fnc = (tweet, criteriaName, value) => (tweet[criteriaName] === value);
			break;
	}
	
	return fnc;
}

exports.searchByCriteria = searchByCriteria;
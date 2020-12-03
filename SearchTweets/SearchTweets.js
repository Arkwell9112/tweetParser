function searchByCriteria({ tweets, criteriaName, value, operand, fncOperand }){
	let isFillingCriteriaFnc = fncOperand ? fncOperand : getFunctionFor(operand);
	return tweets.filter(tweet => isFillingCriteriaFnc(tweet, criteriaName, value));
}

function getFunctionFor(operand){
	
	let fnc;
	
	switch(operand){
		
		case "=" :
		case "equ" :
		case "equals" :
			fnc = (tweet, criteriaName, value) => (tweet[criteriaName] === value);
			break;
		
		case "!=" : 
		case "neq" : 
		case "notEquals" : 
			fnc = (tweet, criteriaName, value) => (tweet[criteriaName] !== value);
			break;
			
		case ">" :
		case "gtr" : 
		case "greaterThan" : 
			fnc = (tweet, criteriaName, value) => (tweet[criteriaName] > value);
			break;
			
		case ">=" :
		case "geq" : 
		case "greaterThanOrEquals" : 
			fnc = (tweet, criteriaName, value) => (tweet[criteriaName] >= value);
			break;
			
		case "<" :
		case "lss" :
		case "lessThan" : 
			fnc = (tweet, criteriaName, value) => (tweet[criteriaName] < value);
			break;
			
		case "<" :
		case "leq" :
		case "lessThanOrEquals" : 
			fnc = (tweet, criteriaName, value) => (tweet[criteriaName] <= value);
			break;
			
		case "oneOf" : 
			fnc = (tweet, criteriaName, values) => (values.includes(tweet[criteriaName]));
			break;
		
		case "between" :
			fnc = (tweet, criteriaName, values) => (values[0] <= tweet[criteriaName] && values[1] >= tweet[criteriaName] );
			break;
			
		case "notBetween" :
			fnc = (tweet, criteriaName, values) => (values[0] > tweet[criteriaName] && values[1] < tweet[criteriaName] );
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
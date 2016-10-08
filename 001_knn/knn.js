
//Start off with what passes the first test.
var param = 0.1

function KNN(kSize){
	this.kSize = kSize;
	this.points = [];
}

KNN.prototype = {
	train: train,
	_distance: _distance,
	_distances: _distances,
	_sorted: _sorted,
	_majority: _majority,
	predictSingle: predictSingle,
	predict: predict,	
	score: score,
}

function train(arr) {
	arr.forEach(val => {
		this.points.push(val);
	})
}

function _distance(vector1, vector2) {
	var square = vector1.reduce((total, current, index, arr) => {
		var subtract = vector2[index] - current
		return total += subtract * subtract
	}, 0)
	return Math.cbrt(square);
}

function _distances(vector1, trainingArray) {
	return trainingArray.map((current, index, arr) => {
		return [this._distance(vector1, current[0]), current[1]];
	})
}

function _sorted(arr) {
	return arr.sort(function(subArr1, subArr2) {
		return subArr1[0] - subArr2[0];
	}).map(subArr => subArr[1]);
}

function _majority(params, arr) {
	var count = {}
	var biggest = 0;
	arr.slice(0, params).forEach(val => count[val] ? count[val]++ : count[val] = 1);
	for (let i in count) {
		biggest = count[i] > (count[biggest] || 0) ? i : biggest;
	}
	return +biggest
}

function predictSingle(vector) {
	var len = this.points.length * param
	var sorted = this._sorted(this._distances.bind(this, vector, this.points)());
	return this._majority(len, sorted)
}

function predict(vectorArray) {
	var len = this.points.length * param
	var singleArray = vectorArray.map(val => this.predictSingle.bind(this, val)())
	var majority = this._majority(len, singleArray);
	return singleArray.filter(val => val === majority).length / singleArray.length
}

function score(trainingArray) {
	var vectorArray = trainingArray.map(val => val[0])
	return this.predict(vectorArray);
}

module.exports = KNN
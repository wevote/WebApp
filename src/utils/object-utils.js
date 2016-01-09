export function shallowClone (obj) {
    let target = {};
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            target[i] = obj[i];
        }
    }
    return target;
}

export function cloneWithCandidates (obj) {
    let target = {};
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            if (i === 'candidate_list') {
                target[i] = [];
                obj[i].forEach(c =>
                    target[i].push(shallowClone(_candidate_store[c]))
                )
            } else {
                target[i] = obj[i];
            }
        }
    }
    return target;
}

const dateDecompose = (date) => {
    let c = date.slice(0,10).split('-') 
    const getMonth = (m) => 'JANFEBMARAPRMAYJUNJULAUGSEPOCTNOVDEC'.slice(3*(m-1),3*(m-1)+3)
    return {year:c[0],month:getMonth(c[1]),date:c[2]}
}

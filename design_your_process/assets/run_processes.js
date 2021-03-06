function write_equation_output(name, humanized, equation, result, id, unit, success) {
	if ($('#equations_output').html() == "" ) {
		var equations_output_head = "<div class=\"equation_evaluations\">\n<h3>Equation Evaluations</h3>\n<table id=\"equation_evaluations_table\">";
		equations_output_head += "<tr><th>Name</th><th>Value</th><th>Unit</th><th>Definition</th><th>Evaluation</th></tr>";
		var equations_output_tail = "</table>\n</div>\n";
		$('#equations_output').html(equations_output_head + equations_output_tail);
	}

	//var unit = 'tbd';
        if (unit == null) {
            unit = 'N/A';
        }

	var new_row = '<td>' + name + '</td><td>' + result + '</td><td>' + unit + '</td><td>' +  humanized + '</td><td>' + equation + '</td>';
	if ($('#equation_' + id).length > 0) {
		$('#equation_' + id).html(new_row);
	} else {
		new_row = '<tr id="' + 'equation_' + id + '">' + new_row + '</tr>' + "\n";
		$('#equation_evaluations_table').append(new_row);
	}
        
        if (success) {
            $('#equation_' + id).removeClass('error_row');
        } else {
            $('#equation_' + id).addClass('error_row');
        }
}

/**
*
*
*
**/
function evaluate(event) {
    var process_id = $('#process_id').val();
    var process = all_processes.get_process_by_id(process_id);
    var params = {};
    //grab inputs
    $('input').each(function(inp) {
        var param_id;
        if ($(this).attr('id').match(/value/)) {
            param_id = $(this).attr('id').substring(6);
            params[param_id] = $(this).val();
        }
    });
    
    //calculate equations
    for (var eq in process.equations) {
        var equation = process.equations[eq];
        var result ;
        var equation_human_name = equation_to_human_name(equation.equation);
        var equation_with_replacements = evaluate_equation(process, equation.name, params);
        var success = true;
        try {
		result = run_calculation(process, equation.name, params);
		result = result.toPrecision(3);
        } catch (error) {
		result = error;
                success = false;
        }
	write_equation_output(equation.name, equation_human_name, equation_with_replacements, result, equation.id, equation.unit, success);
    }
}
    
    jQuery(document).ready(
        function() {
            $('input').bind('keyup', evaluate);
            $('input').bind('paste', evaluate);
            $('input').bind('input', evaluate);
        });


